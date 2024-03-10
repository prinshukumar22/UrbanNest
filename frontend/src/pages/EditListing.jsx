import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { app } from "../../oAuth";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const EditListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  const params = useParams();

  console.log(file);
  console.log(formData);

  useEffect(() => {
    fetch(`/api/listing/get/${params.listingId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          throw new Error(data.message);
        }
        setFormData(data.listing);
      })
      .catch((err) => setError(err.message));
  }, []);

  const uploadListingHandler = () => {
    setUploading(true);
    if (file.length > 0 && file.length + formData.imageUrls.length < 7) {
      const promises = [];
      for (let i = 0; i < file.length; i++) {
        promises.push(storeImage(file[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setUploading(false);
          setImageUploadError(false);
        })
        .catch(() => {
          setUploading(false);
          setImageUploadError("You can only upload images upto 2mb size");
        });
    } else {
      setUploading(false);
      setImageUploadError("Maximum 6 Images are allowed.");
    }
  };

  const storeImage = async (fileToUpload) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + fileToUpload.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (err) => {
          reject(err);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, id) => id !== index),
    });
  };

  const changeInputHandler = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    } else if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setCreateSuccess(false);

    if (formData.imageUrls.length < 1) {
      setLoading(false);
      return setError("You must select atleast one image");
    }
    if (+formData.discountPrice > +formData.regularPrice) {
      setLoading(false);
      return setError("Discounted price must be less than regular price");
    }

    fetch(`/api/listing/update/${params.listingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (!data.success) {
          throw new Error(data.message);
        }
        setCreateSuccess(data.message);
        console.log(data);
        navigate(`/listing/${data.updatedListing._id}`);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-4xl font-semibold text-center my-6">
        Update Listing
      </h1>
      <form
        onSubmit={submitHandler}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            id="name"
            className="border p-3 rounded-lg"
            required
            onChange={changeInputHandler}
            value={formData.name}
          ></input>
          <textarea
            type="text"
            placeholder="Description"
            id="description"
            className="border p-3 rounded-lg"
            required
            onChange={changeInputHandler}
            value={formData.description}
          ></textarea>
          <input
            type="text"
            placeholder="Address"
            id="address"
            className="border p-3 rounded-lg"
            required
            onChange={changeInputHandler}
            value={formData.address}
          ></input>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={changeInputHandler}
                checked={formData.type === "sale"}
              ></input>
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={changeInputHandler}
                checked={formData.type === "rent"}
              ></input>
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={changeInputHandler}
                checked={formData.parking}
              ></input>
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={changeInputHandler}
                checked={formData.furnished}
              ></input>
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={changeInputHandler}
                checked={formData.offer}
              ></input>
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                onChange={changeInputHandler}
                value={formData.bedrooms}
              ></input>
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                onChange={changeInputHandler}
                value={formData.bathrooms}
              ></input>
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                onChange={changeInputHandler}
                value={formData.regularPrice}
                id="regularPrice"
                required
                min="50"
                max="100000000"
              ></input>
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">(INR/month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  onChange={changeInputHandler}
                  value={formData.discountPrice}
                  type="number"
                  id="discountPrice"
                  required
                  min="0"
                  max="100000"
                ></input>
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">(INR/month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold text-center">
            Images:{" "}
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              multiple
              accept="image/*"
              className="p-3 border border-gray-300 rounded w-full"
              id="images"
              onChange={(e) => {
                setFile(Array.from(e.target.files));
              }}
            ></input>
            <button
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              onClick={uploadListingHandler}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {imageUploadError && (
            <p className="text-red-700 text-sm">{imageUploadError}</p>
          )}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, idx) => (
              <div
                key={idx}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  className="w-20 h-20 object-contain rounded-lg"
                  alt="listing-image"
                ></img>
                <button
                  type="button"
                  onClick={() => {
                    handleRemoveImage(idx);
                  }}
                  className="p-3 text-red-700 rounded-lg uppercase opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            type="submit"
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            disabled={loading || uploading}
          >
            {loading ? "Loading" : "Update Listing"}
          </button>
          {error && <p className="text-red-700 text-center">{error}</p>}
          {createSuccess && (
            <p className="text-green-700 text-center">{createSuccess}</p>
          )}
        </div>
      </form>
    </main>
  );
};

export default EditListing;

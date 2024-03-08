import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { app } from "../../oAuth";

const CreateListing = () => {
  const [file, setFile] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  console.log(file);
  console.log(formData);

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

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-4xl font-semibold text-center my-6">
        Create Listing
      </h1>
      <form className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            id="name"
            className="border p-3 rounded-lg"
            maxLength="62"
            minLength="10"
            required
          ></input>
          <textarea
            type="text"
            placeholder="Description"
            id="description"
            className="border p-3 rounded-lg"
            required
          ></textarea>
          <input
            type="text"
            placeholder="Address"
            id="address"
            className="border p-3 rounded-lg"
            required
          ></input>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sell" className="w-5"></input>
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5"></input>
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5"></input>
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5"></input>
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5"></input>
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
              ></input>
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" id="regularPrice" required></input>
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">(INR/month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" id="discountedPrice" required></input>
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs">(INR/month)</span>
              </div>
            </div>
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
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;

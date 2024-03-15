import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";
const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt_desc",
  });
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlsearchTerm = searchParams.get("searchTerm");
    const urltype = searchParams.get("type");
    const urlparking = searchParams.get("parking");
    const urlfurnished = searchParams.get("furnished");
    const urloffer = searchParams.get("offer");
    const urlsort = searchParams.get("sort");
    console.log(
      urlsearchTerm,
      urltype,
      urloffer,
      urlparking,
      urlfurnished,
      urlsort
    );

    if (
      urlsearchTerm ||
      urlfurnished ||
      urloffer ||
      urlparking ||
      urlsort ||
      urltype
    ) {
      setSidebarData({
        searchTerm: urlsearchTerm || "",
        type: urltype || "all",
        parking: urlparking === "true" ? true : false,
        furnished: urlfurnished === "true" ? true : false,
        offer: urloffer === "true" ? true : false,
        sort: urlsort || "createdAt_desc",
      });
    }

    setShowMore(false);
    setLoading(true);
    fetch(
      `/api/listing/get?searchTerm=${urlsearchTerm}&type=${urltype}&offer=${urloffer}&parking=${urlparking}&furnished=${urlfurnished}&sort=${urlsort}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (!data.success) throw new Error(data.message);
        if (data.listings.length > 8) setShowMore(true);
        else setShowMore(false);
        setListings(data.listings);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [location.search]);

  const [listings, setListings] = useState([]);

  const navigate = useNavigate();
  console.log(sidebarData);

  const handleChange = (e) => {
    if (e.target.type === "text") {
      setSidebarData({ ...sidebarData, [e.target.id]: e.target.value });
    } else if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({
        ...sidebarData,
        type: e.target.id,
      });
    } else if (
      e.target.id === "offer" ||
      e.target.id === "parking" ||
      e.target.id === "furnished"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]: !sidebarData[e.target.id],
      });
    } else if (e.target.id === "sort_order") {
      setSidebarData({
        ...sidebarData,
        sort: e.target.value,
      });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(
      `/search?searchTerm=${sidebarData.searchTerm}&type=${sidebarData.type}&offer=${sidebarData.offer}&parking=${sidebarData.parking}&furnished=${sidebarData.furnished}&sort=${sidebarData.sort}`
    );
  };

  const onShowMoreHandler = async () => {
    const noOfListings = listings.length;
    const startIndex = noOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("index", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data.listings]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={submitHandler} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-4 flex-wrap items-center">
            <label className="font-semibold">Type: </label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "all"}
              ></input>
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "rent"}
              ></input>
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "sale"}
              ></input>
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.offer}
              ></input>
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap items-center">
            <label className="font-semibold">Amenities: </label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.parking}
              ></input>
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.furnished}
              ></input>
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort: </label>
            <select
              id="sort_order"
              className="border rounded-lg p-3"
              onChange={handleChange}
              defaultValue={"createdAt_desc"}
            >
              <option
                selected={sidebarData.sort === "regularPrice_desc"}
                value={"regularPrice_desc"}
              >
                Price high to low
              </option>
              <option
                selected={sidebarData.sort === "regularPrice_asc"}
                value={"regularPrice_asc"}
              >
                Price low to high
              </option>
              <option
                selected={sidebarData.sort === "createdAt_desc"}
                value={"createdAt_desc"}
              >
                Latest
              </option>
              <option
                selected={sidebarData.sort === "createdAt_asc"}
                value={"createdAt_asc"}
              >
                Oldest
              </option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
          >
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}
          {listings.length > 0 &&
            listings.map((listing, idx) => (
              <ListingCard key={idx} listing={listing}></ListingCard>
            ))}
          {showMore && (
            <button
              onClick={onShowMoreHandler}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;

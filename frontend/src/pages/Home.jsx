import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingCard from "../components/ListingCard";
const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings, saleListings, rentListings);
  useEffect(() => {
    fetch("/api/listing/get?offer=true&limit=4")
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.message);
        setOfferListings(data.listings);
        return fetch("/api/listing/get?type=sale&limit=4");
      })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.message);
        setSaleListings(data.listings);
        return fetch("/api/listing/get?type=rent&limit=4");
      })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.message);
        setRentListings(data.listings);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      {/* Top */}
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">Perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Sahand Estate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          {"Let's get started"}
        </Link>
      </div>

      {/* Swiper */}
      <Swiper navigation>
        {saleListings &&
          saleListings.length > 0 &&
          saleListings.map((listing, idx) => (
            <SwiperSlide key={idx}>
              <div
                style={{
                  backgroundSize: "cover",
                  backgroundImage: `url(${listing.imageUrls[0]})`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing, idx) => (
                <ListingCard listing={listing} key={idx}></ListingCard>
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing, idx) => (
                <ListingCard listing={listing} key={idx}></ListingCard>
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing, idx) => (
                <ListingCard listing={listing} key={idx}></ListingCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

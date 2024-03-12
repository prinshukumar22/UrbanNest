import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  console.log(listing);

  useEffect(() => {
    fetch(`/api/user/${listing.userRef}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.message);
        setLandlord(data.user);
      })
      .catch((err) => console.log(err));
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-3">
          <h1 className="text-slate-700 text-1xl">
            Contact{" "}
            <span className="font-semibold">{`${landlord.username}`}</span> for{" "}
            <span className="font-semibold">{`${listing.name}`}</span>
          </h1>
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            className="w-full p-3 rounded-lg border"
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject= Regarding ${listing.name}&body=${message}`}
            className="p-3 w-full rounded-lg text-slate-100 bg-slate-700 uppercase text-center hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;

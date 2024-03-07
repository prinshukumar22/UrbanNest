import Listing from "../model/listing.model.js";
export const createListing = (req, res, next) => {
  const newListing = new Listing({
    ...req.body,
  });

  newListing.save().then((result) => {
    res.status(200).json({
      message: "Created listing successfully!",
      success: true,
      listing: result,
    });
  });
};

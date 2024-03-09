import Listing from "../model/listing.model.js";
import { errorHandler } from "../utils/errorHandler.js";
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

export const getListings = (req, res, next) => {
  if (req.user.userId != req.params.userId)
    return next(errorHandler(401, "You can only see your listings"));

  Listing.find({ userRef: req.params.userId })
    .then((listings) => {
      res.status(200).json({
        message: "Listings retrieved successfully!",
        success: true,
        listings: listings,
      });
    })
    .catch((err) => {
      next(errorHandler(500, err.message));
    });
};

export const deleteListing = (req, res, next) => {
  Listing.findById(req.params.listingId).then((listing) => {
    if (!listing) {
      return next(errorHandler(404, "No such listing exists"));
    }

    if (req.user.userId !== listing.userRef.toString()) {
      return next(errorHandler(404, "You can only delete your own listings"));
    }
  });

  Listing.deleteOne({ _id: req.params.listingId })
    .then(() =>
      res.status(200).json({
        message: "Listing deleted successfully",
        success: true,
      })
    )
    .catch((err) => next(errorHandler(err)));
};

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

export const getListing = (req, res, next) => {
  Listing.findById(req.params.listingId)
    .then((listing) => {
      if (!listing) throw new Error("No such listing exists");
      res.status(201).json({
        success: true,
        listing,
      });
    })
    .catch((err) => next(errorHandler(404, err.message)));
};

export const getAllListings = (req, res, next) => {
  console.log(req.query);
  const limit = parseInt(req.query.limit) || 9; //! no of listings per page
  const startIndex = parseInt(req.query.index) || 0; //! page no

  let offer = req.query.offer;
  if (offer === "false" || offer === undefined) {
    offer = { $in: [true, false] };
  }

  let parking = req.query.parking;
  if (parking === "false" || parking === undefined) {
    parking = { $in: [true, false] };
  }

  let furnished = req.query.furnished;
  if (furnished === "false" || furnished === undefined) {
    furnished = { $in: [true, false] };
  }

  let type = req.query.type;
  if (type === "all" || type === undefined) {
    type = { $in: ["sale", "rent"] };
  }

  const searchTerm = req.query.searchTerm || "";
  const sort = req.query.sort?.split("_")[0] || "createdAt";
  const order = req.query.sort?.split("_")[1] || "desc";

  Listing.find({
    name: { $regex: searchTerm, $options: "i" },
    offer,
    furnished,
    parking,
    type,
  })
    .sort({ [sort]: order })
    .limit(limit)
    .skip(startIndex)
    .then((listings) => {
      res.status(200).json({
        listings,
        success: true,
      });
    })
    .catch((err) => next(errorHandler(404, err.message)));
};

export const deleteListing = (req, res, next) => {
  Listing.findById(req.params.listingId)
    .then((listing) => {
      if (!listing) {
        throw new Error("No such listing exists");
      }

      if (req.user.userId !== listing.userRef) {
        throw new Error("You can only delete your own listings");
      }
    })
    .catch((err) => next(errorHandler(404, err)));

  Listing.deleteOne({ _id: req.params.listingId })
    .then(() => {
      res.status(200).json({
        message: "Listing deleted successfully",
        success: true,
      });
    })
    .catch((err) => next(errorHandler(404, err)));
};

export const updateListing = (req, res, next) => {
  Listing.findByIdAndUpdate(req.params.listingId, req.body, { new: true })
    .then((updatedListing) => {
      if (req.user.userId !== updatedListing.userRef) {
        throw new Error("You can only update your listings");
      }
      res.status(200).json({
        success: true,
        message: "Listing Updated Successfully",
        updatedListing,
      });
    })
    .catch((err) => {
      next(errorHandler(404, err));
    });
};

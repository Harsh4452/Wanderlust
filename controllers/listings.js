// const Listing = require("../models/Listing");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken = process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// // 1. INDEX ROUTE
// // Show all listings or filtered listings if query param is provided

// module.exports.index = async (req, res) => {
//     const { search, category } = req.query;
//     let query = {};

//     if (search) {
//         query.$or = [
//             { title: { $regex: search, $options: "i" } },
//             { country: { $regex: search, $options: "i" } }
//         ];
//     }

//     if (category) {
//         query.category = category;
//     }

//     const allListings = await Listing.find(query).populate("owner");

//     res.render("listings/index", {
//         allListings,
//         currUser: req.user,
//         searchQuery: search || ""
//     });
// };


// // 2. SHOW ROUTE
// module.exports.showListing = async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id)
//         .populate({
//             path: "reviews",
//             populate: { path: "author" },
//         })
//         .populate("owner");
//     if (!listing) {
//         req.flash("error", "Listing doesn't exist");
//         return res.redirect("/listings");
//     }
//     res.render("listings/show.ejs", { listing });
// };

// // 3. NEW ROUTE
// module.exports.renderNewForm = (req, res) => {
//     res.render("listings/new.ejs");
// };

// // 4. CREATE ROUTE
// module.exports.createListing = async (req, res, next) => {
//     const response = await geocodingClient.forwardGeocode({
//         query: req.body.listing.location,
//         limit: 1
//     }).send();

//     const url = req.file.path;
//     const filename = req.file.filename;

//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//     newListing.image = { url, filename };
//     newListing.geometry = response.body.features[0].geometry;

//     // Minimal addition: assign category if provided in form
//     if (req.body.listing.category) {
//         newListing.category = req.body.listing.category;
//     }

//     await newListing.save();
//     req.flash("success", "New Listing Created");
//     res.redirect("/listings");
// };

// // 5. EDIT FORM
// module.exports.renderEditForm = async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
//     if (!listing) {
//         req.flash("error", "Listing doesn't exist");
//         return res.redirect("/listings");
//     }
//     let originalImageUrl = listing.image.url.replace("/upload", "/upload/h_300,w_250");
//     res.render("listings/edit.ejs", { listing, originalImageUrl });
// };

// // 6. UPDATE LISTING
// module.exports.updateListing = async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

//     if (req.file) {
//         const url = req.file.path;
//         const filename = req.file.filename;
//         listing.image = { url, filename };
//         await listing.save();
//     }

//     req.flash("success", "Listing Updated");
//     res.redirect(`/listings/${id}`);
// };

// // 7. DELETE LISTING
// module.exports.destroyListing = async (req, res) => {
//     const { id } = req.params;
//     await Listing.findByIdAndDelete(id);
//     req.flash("success", "Listing Deleted");
//     res.redirect("/listings");
// };
const Listing = require("../models/Listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// 1. INDEX ROUTE
// Show all listings or filtered listings if query param is provided
module.exports.index = async (req, res) => {
    const { search, category } = req.query;
    let query = {};

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } }
        ];
    }

    if (category) {
        query.category = category;
    }

    const allListings = await Listing.find(query).populate("owner");

    return res.render("listings/index", {
        allListings,
        currUser: req.user,
        searchQuery: search || ""
    });
};


// 2. SHOW ROUTE
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing doesn't exist");
        return res.redirect("/listings"); // ✅ return added
    }

    return res.render("listings/show.ejs", { listing }); // ✅ return added
};

// 3. NEW ROUTE
module.exports.renderNewForm = (req, res) => {
    return res.render("listings/new.ejs"); // ✅ return added
};

// 4. CREATE ROUTE
module.exports.createListing = async (req, res, next) => {
    const response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();

    const url = req.file.path;
    const filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;

    if (req.body.listing.category) {
        newListing.category = req.body.listing.category;
    }

    await newListing.save();
    req.flash("success", "New Listing Created");
    return res.redirect("/listings"); // ✅ return added
};

// 5. EDIT FORM
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing doesn't exist");
        return res.redirect("/listings"); // ✅ return added
    }

    let originalImageUrl = listing.image.url.replace("/upload", "/upload/h_300,w_250");
    return res.render("listings/edit.ejs", { listing, originalImageUrl }); // ✅ return added
};

// 6. UPDATE LISTING
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
        const url = req.file.path;
        const filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated");
    return res.redirect(`/listings/${id}`); // ✅ return added
};

// 7. DELETE LISTING
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    return res.redirect("/listings"); // ✅ return added
};

const Listing = require("../models/listing.js");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("new.ejs");
};

module.exports.createListing = async (req, res) => {
    if (!req.user) {
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    let url = req.file.path;
    let filename = req.file.filename;
    let { title, description, image, price, location, country, category } = req.body.listing;
    if (typeof category === "string") {
        category = [category];
    }
    const newProperty = new Listing({
        title,
        description,
        image,
        price: Number(price),
        location,
        country,
        category
    });
    newProperty.owner = req.user._id;
    newProperty.image = { url, filename };
    await newProperty.save();
    req.flash("success", "New listing created!!");
    res.redirect("/listing");
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not exits!!");
        return res.redirect("/listing");
    }
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/w_250");
    res.render("edit.ejs", { listing, originalUrl });
};

module.exports.saveListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing updated!!");
    res.redirect(`/listing/${id}`);
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "createdBy" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not exits!!");
        return res.redirect("/listing");
    }
    res.render("show.ejs", { listing });
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!!");
    res.redirect("/listing");
};

module.exports.categoryListing = async (req, res) => {
    let category = decodeURIComponent(req.params.category);

    const listings = await Listing.find({
        category: category
    });

    res.render("index.ejs", { allListings: listings, selectedCategory: category });
}

module.exports.searchQuery = async (req, res) => {
    let { q } = req.query;

    if (!q) {
        req.flash("error", "Search query missing");
        return res.redirect("/listing");
    }

    const listings = await Listing.find({
        $or: [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } }
        ]
    });

    res.render("index.ejs", { allListings: listings, searchQuery: q });
}
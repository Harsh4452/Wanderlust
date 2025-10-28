// 1st require express and router object
const express=require("express");
const router=express.Router();
const Listing=require("../models/Listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })  //multer will store files in cloudinary storage



router.route("/")
    .get(wrapAsync(listingController.index))  //1 index route
    .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));   //4 create route

    


    //3 new route its mandotary to be above show route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))  //2 show route
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,wrapAsync(listingController.updateListing)) //6 update route
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))   //7 delete route



//5 edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))

router.get("/filter/:category", wrapAsync(listingController.filterListings));
module.exports=router;



//2. Sample listing models
// app.get("/ListingSchema",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         location:"Calungate, Goa",
//         country:"India",
//         price:1000,


//     });
//     await sampleListing.save();
//     console.log("db was saved");
//     res.send("Success");
// })

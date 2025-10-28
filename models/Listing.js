//mongo schema for listing of products
const { ref } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const listingSchema=new Schema({
    title:{
        type:String,
        required:true,

    },
    price:{
      
      type:Number,
      
    },
  //   image: {
  //   filename: {
  //     type: String,
  //     default: "listingimage"
  //   },
  //   url: {
  //     type: String,
  //     default:
  //       "https://www.istockphoto.com/photo/international-airport-terminal-asian-beautiful-woman-with-luggage-and-walking-in-gm1440399157-480399791",
  //     set: (v) =>
  //       v === ""
  //         ? "https://www.istockphoto.com/photo/international-airport-terminal-asian-beautiful-woman-with-luggage-and-walking-in-gm1440399157-480399791"
  //         : v
  //   }
  // },
    
    
    
    
    description:{
        type:String,
        required:true,
    },
    image:{
      url:String,
      filename:String,
    },
    price:Number,
    location:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    reviews:[{
      type:Schema.Types.ObjectId,
      ref:"Review"  //model name
    }],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User"

    },
    category: {   // <-- added category
        type: [String],
        enum: ["trending","rooms","iconic cities","mountains","castles","pools","camping","farms","arctic","domes","boats"],
        default: "trending"
    },
    geometry:{
      type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }

});

//post mongoose schema for review
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express')
const app = express();
const mongoose=require("mongoose");
const path = require('path');  //to connect db to our ejs
const ejsMate=require("ejs-mate");   //for boilerplate code
app.engine("ejs",ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));   //for tempelate ejs file
app.use(express.urlencoded({ extended: true }));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));  //for css file
const ExpressError=require("./utils/ExpressError.js")
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User=require("./models/user.js");


const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const dbUrl=process.env.ATLASDB_URL;
const port = process.env.PORT || 8080;

main().then(()=>{
    console.log("database connected");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(dbUrl);  //To wait for the connection to complete before running the next line, you need to use await.
}
// app.get("/",(req,res)=>{
//     res.send("Hi i am root");
// })

const store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,   //toucafter is wen we time in sec for store session
});

store.on("error",()=>{
    console.log("Error in MONGO SESSION STORE",err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+ 7 * 24* 60* 60*1000,
        maxAge:7 * 24* 60* 60*1000,
        httpOnly: true,
    }
};



//flash:gives alert like popup once
app.use(session(sessionOptions));
app.use(flash());

//passport:auth middleware for node.js
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"harshalgb824@gmail.com",
//         username:"delta-student",
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");  //register(data,password) is method
//     res.send(registeredUser);
// })



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;   //we cant access req.user in navbar.ejs directly so we use this
    next();
})

app.get("/", (req, res) => {
    res.redirect("/listings"); // redirect to your listings page
});

app.use("/",userRouter);  //it should be first then listing then review
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);






// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page not found"));
// });

app.use((err, req, res, next) => {
    let { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong";
    res.status(statusCode).render("error.ejs", { err });
});



app.listen(port, () => {
    console.log(`App is listening at ${port}`);
});





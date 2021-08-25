if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

// console.log(process.env.CLOUDINARY_CLOUD_NAME);


const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override')
const {campgroundSchema,reviewSchema} = require('./schemas')
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/reviews');
const Campground = require('./models/campground');
const User = require('./models/user');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const{isLoggedIn} = require('./middleware')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const MongoDBStore = require("connect-mongo");


const campgroundRoute = require('./routes/campground');
const reviewRoute = require('./routes/reviews');
const userRoute = require('./routes/user');

const dbUrl = process.env.DB_URL ||'mongodb://localhost:27017';
const secret = process.env.SECRET || 'thisisnotagoodesecret'

app.use(express.urlencoded({ extended: true }));
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))
app.use(mongoSanitize({
    replaceWith: '_'
}))

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret:secret,
    touchAfter:24*60*60 //Check if the info is same then it won't be updated and updated after give time must be in seconds
})

store.on("error",function(e){
    console.log("Session store error",e);
})

const sessionConfig = {
    store: store,
    name: 'session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
          // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
}
}
app.use(session(sessionConfig));
app.use(flash());

app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/webd-bootcamp/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



app.use(passport.initialize());
app.use(passport.session());  //should be use before the app.use(session());

passport.use(new LocalStrategy(User.authenticate()));  // It was telling passport to use that strategy in the passport 
passport.serializeUser(User.serializeUser()); // Serialize and Deserialize are used for setting up of the session and removing it after .
passport.deserializeUser(User.deserializeUser());

const mongoose = require('mongoose');
const { required } = require('joi');



mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true , useUnifiedTopology: true,
useUnifiedTopology: true,
useFindAndModify: false})
    .then(()=>{
        console.log("Connection Established !");
    })
    .catch(err=>{
        console.log("OH NO ERROR!!!!");
        console.log(err);
    })

app.engine('ejs',ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname,'public')))


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/',userRoute);
app.use('/campground',campgroundRoute);
app.use('/campground/:id/reviews',reviewRoute)


app.get('/', (req, res) => {
    res.render('home');
})

app.all('*',(req,res,next) => {
   next(new ExpressError("HI do you know me ",400)); 
})


app.use((err,req,res,next) => {
    const {status=500 , message="Page not found"} = err;
    if(!err.message){
        err.message = " OH NO we got an Error"
    }
    res.status(status).render('error',{err});
    // res.send("OH BOY!!! We Hit the Wrong Route.")
})

const port = process.env.PORT || 3000;


app.listen(port,()=>{
    console.log(`Serving on the port ${port}`);
})
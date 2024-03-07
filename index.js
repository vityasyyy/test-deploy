if(process.env.NODE_ENV !== "production") { 
    require('dotenv').config()
}
const helmet = require("helmet");
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize')
const MongoStore = require('connect-mongo')
const User = require('./models/user');

const foodplacesRoutes = require('./routes/foodplacesRoutes')
const reviewsRoutes = require('./routes/reviewsRoutes')
const usersRoutes = require('./routes/usersRoutes');

const ExpressError = require('./utilities/ExpressError');

const dbURL = process.env.DBURL

const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
mongoose.connect(dbURL)
    .then(() => {
        console.log("MONGO CONNECTED!!");
    })
    .catch((err) => {
        console.log("MONGO ERROR OCCURED");
        console.log(err); 
    })

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());

const secret = process.env.SECRET;

const store = MongoStore.create({
    mongoUrl: dbURL,
    touchAfter: 24 * 60 & 60,
    crypto: {
        secret,
    }
})

store.on("error", function (e) {
    console.log("Session store error", e);
})

const sessionConfig = {
    store: store,
    secret,
    resave: false,
    saveUninitialized: false,
    cookies: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://stackpath.bootstrapcdn.com", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://stackpath.bootstrapcdn.com", "https://kit-free.fontawesome.com", "https://fonts.googleapis.com", "https://use.fontawesome.com", "https://cdn.jsdelivr.net"],
            workerSrc: ["'self'", "blob:"],
            objectSrc: ["'none'"],
            imgSrc: ["'self'", "blob:", "data:", "https://res.cloudinary.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com"],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next) => {
    res.locals.signedInUser = req.user; 
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.redirect('/register')
})
app.use('/', usersRoutes)
app.use('/foodplaces', foodplacesRoutes);
app.use('/foodplaces/:id/review', reviewsRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "Something is wrong"
    res.status(statusCode).render('error', {err});
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`LISTENING FROM PORT ${PORT}, ctrl+c to quit`);
})

module.exports = app;
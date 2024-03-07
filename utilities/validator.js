const { foodplaceSchema, reviewSchema } = require('../schemas');
const ExpressError = require('../utilities/ExpressError');
const Review = require('../models/review');
const FoodPlace = require('../models/foodplaceSchema');

const validatefoodplace = (req, res, next) => {
    const {error} = foodplaceSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}

const validatereview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}

const isAuthor = async (req, res, next) => {
    const {id} = req.params
    const foodplace = await FoodPlace.findById(id)
    if(!foodplace.author.equals(req.user._id)){
        req.flash('error', 'You do not have the permission')
        return res.redirect(`/foodplaces/${id}`)
    }
    next();
}
const isreviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user.id)) {
        req.flash('error', 'You do not have permission');
        return res.redirect(`/foodplaces/${id}`)
    }
    next()
}   
const storeReturnTo = (req, res, next) => {
    if(req.res.returnTo) {
        res.locals.returnTo = req.session.returnTo
    }
    next();
}
const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', "Sign up first");
        return res.redirect('/register');
    }
    next();
}
module.exports = { validatefoodplace, validatereview, isAuthor, isLoggedIn, isreviewAuthor, storeReturnTo };

const Review = require('../models/review')
const FoodPlace = require('../models/foodplaceSchema');

module.exports.postreview = async (req, res) => {
    const {id} = req.params
    const userId = req.user._id;
    // const existingreview = await review.findOne({ foodplace: id, author: userId });
    //     if (existingreview) {
    //         req.flash('error', 'You have already submitted a reviewration for this foodplace.');
    //         return res.redirect(`/foodplaces/${id}`);
    //     }
    const foodplace = await FoodPlace.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    foodplace.reviews.push(review);
    await review.save();
    await foodplace.save();
    req.flash('success', 'Thanks for the review!')
    res.redirect(`/foodplaces/${foodplace.id}`);
}

module.exports.deletereview = async(req, res) => {
    const {id, reviewId} = req.params;
    await FoodPlace.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted!')
    res.redirect(`/foodplaces/${id}`)
}
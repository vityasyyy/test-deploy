const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const Review = require('./review');


const imageSchema = new Schema({
    url: String,
    filename: String
})
imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200')
})
const foodplaceSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    image: [imageSchema], 
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {   
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ]
})
foodplaceSchema.post('findOneAndDelete', async function (foodplace) {
     if (foodplace.reviews.length) {
        await Review.deleteMany({ _id: { $in: foodplace.reviews }});
     }
})
module.exports = mongoose.model('FoodPlace', foodplaceSchema);
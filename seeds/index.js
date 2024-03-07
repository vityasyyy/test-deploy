
const mongoose = require('mongoose');
const FoodPlace = require('../models/foodPlace');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/eventsDB')
    .then(() => {
        console.log("MONGO CONNECTED!!");
    })
    .catch((err) => {
        console.log("MONGO ERROR OCCURED");
        console.log(err); 
    })
const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await FoodPlace.deleteMany({});
    for(let i = 0; i < 5; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const event = new Event({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            name: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto corporis itaque natus laudantium delectus blanditiis impedit numquam tempore. Illum veniam distinctio facilis maxime asperiores nam corrupti necessitatibus nulla magnam. Soluta Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur rerum, iste impedit cum error expedita ex aut. Necessitatibus, corporis veniam nostrum accusantium, nulla quas aliquid laborum nesciunt iure consequuntur magni. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est illo, porro dolores officia, nisi eius totam cumque neque nobis necessitatibus dolor id adipisci nesciunt, iusto dicta ipsa vero. Est, illum',
            date: '23-22-2202'
        })  
        await event.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})
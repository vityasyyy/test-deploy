
const FoodPlace = require('../models/foodplaceSchema')
const {cloudinary} = require('../Cloudinary');

module.exports.index = async (req,res) => {
    const foodplaces = await FoodPlace.find({});
    res.render('foodplaces/index', { foodplaces });
}


module.exports.renderNewForm = (req,res) => {
    res.render('foodplaces/new');
}

module.exports.newfoodplacesPost = async (req,res, next) => {
    const newfoodplace= new FoodPlace(req.body.foodplaces)
    newfoodplace.image = req.files.map(file => ({url: file.path, filename: file.filename}));
    newfoodplace.author = req.user._id;
    await newfoodplace.save();
    req.flash('success', 'Successfully made a new foodplace!');
    res.redirect(`/foodplaces/${newfoodplace._id}`);
}

module.exports.foodplaceShowPage = async (req,res) => {
    const {id} = req.params;
    const foodplace = await FoodPlace.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if(!foodplace){
        req.flash('error', "Cannot find the foodplace u are looking for!");
        return res.redirect('/foodplaces')
    }
    res.render('foodplaces/show', { foodplace });
}

module.exports.editfoodplaceForm = async (req,res) => {
    const {id} = req.params;
    const foodplace = await FoodPlace.findById(id);
    if(!foodplace){
        req.flash('error', "Cannot find the foodplace u are looking for!");
        return res.redirect('/foodplaces')
    }
    res.render('foodplaces/edit', { foodplace });
}

module.exports.editfoodplacePost = async (req,res) => {
    const {id} = req.params;
    const foodplace = await FoodPlace.findByIdAndUpdate(id, {...req.body.foodplaces})
    const imgs = req.files.map(file => ({url: file.path, filename: file.filename}));
    foodplace.image.push(...imgs);
    await foodplace.save()
    if(req.body.deleteImage) {
        for(let filename of req.body.deleteImage) {
            await cloudinary.uploader.destroy(filename)
        }
        await foodplace.updateOne({$pull: {image: {filename: {$in: req.body.deleteImage}}}})

    }
    req.flash('success', 'Updated a foodplace!')
    res.redirect(`/foodplaces/${foodplace._id}`);
}

module.exports.deletefoodplace = async (req,res) => {
    const {id} = req.params;
    await FoodPlace.findByIdAndDelete(id);
    req.flash('success', 'foodplace deleted!')
    res.redirect('/foodplaces');
}
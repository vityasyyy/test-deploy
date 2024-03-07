const express = require('express');
const router = express.Router({mergeParams: true});
const foodplaces = require('../Controllers/foodplaces');
const asyncWrap = require('../utilities/asyncWrap');
const {isLoggedIn, isAuthor, validatefoodplace} = require('../utilities/validator');
const multer = require('multer')
const {storage} = require('../Cloudinary');
const upload = multer({
    storage: storage,
    limits: {
        files: 5
    }
});


router.route('/')
    .get(asyncWrap(foodplaces.index))
    .post(isLoggedIn, upload.array('image'), validatefoodplace, asyncWrap(foodplaces.newfoodplacesPost))

router.get('/new', isLoggedIn, foodplaces.renderNewForm)

router.route('/:id')
    .get(asyncWrap(foodplaces.foodplaceShowPage))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatefoodplace, asyncWrap(foodplaces.editfoodplacePost))
    .delete(isLoggedIn, isAuthor, asyncWrap(foodplaces.deletefoodplace))

router.get('/:id/edit', isLoggedIn, isAuthor, asyncWrap(foodplaces.editfoodplaceForm))

module.exports = router;
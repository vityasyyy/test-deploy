const express = require('express');
const router = express.Router({mergeParams: true});

const asyncWrap = require('../utilities/asyncWrap');
const {validatereview, isLoggedIn, isreviewAuthor} = require('../utilities/validator');

const reviewers = require('../Controllers/reviews');


router.post('/', isLoggedIn, validatereview, asyncWrap(reviewers.postreview))
router.delete('/:reviewId', isLoggedIn, isreviewAuthor, asyncWrap(reviewers.deletereview))

module.exports = router;
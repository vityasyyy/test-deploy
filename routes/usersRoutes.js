const express = require('express');
const router = express.Router({mergeParams: true});
const passport = require('passport');

const asyncWrap = require('../utilities/asyncWrap');
const {storeReturnTo} = require('../utilities/validator');

const users = require('../Controllers/users')

router.route('/register')
    .get(users.registerForm)
    .post(asyncWrap(users.registerUser))

router.route('/login')
    .get(users.loginForm)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.loginUser)

router.get('/logout', users.logoutUser)

module.exports = router;
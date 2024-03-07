const express = require('express');
const router = express.Router({mergeParams: true});
const passport = require('passport');

const User = require('../models/user')

const asyncWrap = require('../utilities/asyncWrap');
const {storeReturnTo} = require('../utilities/validator');

module.exports.registerForm = (req, res) => {
    res.render('userEjs/register')
}

module.exports.registerUser = async (req, res) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', `Welcome to the page ${registeredUser.username}`);
            res.redirect('/foodplaces');
        })
    }  catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}

module.exports.loginForm = (req, res) => {
    res.render('userEjs/login')
}

module.exports.loginUser = (req, res) => {
    req.flash('success', `Welcome back!!`)
    const redirectUrl = req.session.returnTo || '/foodplaces'
    delete req.session.returnTo
    res.redirect('/foodplaces')
}

module.exports.logoutUser = (req, res) => {
    req.logout(function (err) {
        if(err){
            return next(err);
        }
    })
    req.flash('success', 'Thanks for visiting')
    res.redirect('/foodplaces')
}
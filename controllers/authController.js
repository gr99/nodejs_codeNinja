const User = require('../models/user')
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")

module.exports.signup_get = (req, res) => {
    res.render('signup');
};

//handaling error or Extracting exact error

const handleError = (err) => {
    console.log(err.message, err.code)
    let error = {email: '', password: ''};
    //incorrect email
    if (err.message==='incorrect email')
    {
        error.email='Incorrect Email Not Registed'
    }
    //incorrect password
    if (err.message==='incorrect password')
    {
        error.password='Incorrect Password'
    }
    //duplicate email
    if (err.code === 11000) {
        error.email = 'User Already Registered ';
        return error
    }
    //validation error
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            error[properties.path] = properties.message;
        })
        return error;
    }
    return error;

}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, 'SecertkeyHere$20', {
        expiresIn: maxAge
    });
}


module.exports.signup_post = async (req, res) => {

    // const user=new User(req.body)
    // user.save().then((result)=>{res.send(user)}).catch((err)=>{console.log(err)});

    //create using Async method


    const {email, password} = req.body;

    try {
        const user = await User.create({email, password});
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({user: user._id});
    } catch (err) {

        const errors = handleError(err);
        res.status(400).json({errors});
    }

}

module.exports.login_get = (req, res) => {
    res.render('login');
};
module.exports.login_post = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({user: user._id});
    } catch (e) {
        const errors = handleError(e);
        res.status(400).json({errors})
    }
};

module.exports.logout_get=(req,res)=>{
    res.cookie('jwt','', {maxAge: 1});
    res.redirect('/')
}

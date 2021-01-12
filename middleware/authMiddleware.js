
const jwt = require('jsonwebtoken');
const User = require('../models/user');

//this function will varify all the request made to the nodejs
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'SecertkeyHere$20', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                next();
            }
        })
    } else {
        res.redirect('/login')
    }
}
//check which user is login
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'SecertkeyHere$20', async(err, decodedToken) => {
            if (err) {
                console.log(err.message);
                next();
            } else {
                let user=await User.findById(decodedToken.id);
                res.locals.user=user;
                next();
            }
        })
    } else {
        res.locals.user=null;
        next();
    }
}


module.exports = {requireAuth,checkUser};


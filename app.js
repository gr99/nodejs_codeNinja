const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan')
const authRoutes = require('./routes/authRoutes')
const cookieParser=require('cookie-parser')
const {requireAuth,checkUser}=require('./middleware/authMiddleware')

const app = express();

// middleware
app.use(express.json())
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://bidwaigr:test@123@cluster0.d6op1.mongodb.net/node-auth?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// routes
app.get('*',checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);





// //cookies
// app.get('/set-cookie', ((req, res) => {
//     // res.setHeader('Set-Cookie', 'newUser=true');
//     res.cookie('newUser',false);
//     res.cookie('isEmployee',true,{maxAge:1000*60*60*24,httpOnly:true});
//     res.send('You Got the cookies');
// }));
//
// app.get('/read-cookie',((req, res) => {
//     const cookie=req.cookies;
//     res.json(cookie);
//     console.log(cookie);
// }))

const mongoose = require('mongoose')
const chalk = require('chalk')
const {isEmail} = require('validator')
const bcrypt = require('bcrypt');


const userSchema = mongoose.Schema({
    email: {
        type: String
        , required: [true, 'Please Enter An Email']
        , unique: true
        , lowercase: true
        , validate: [isEmail, 'Please Enter Valid Email']
    },
    password: {
        type: String
        , required: [true, 'Please Enter An Password']
        , minlength: [5, 'Minimum Length Should be 5 Char']
    },
}, {timestamps: true});

//fire Function after Document is saved to db

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


//fire Function after Document is saved to db
userSchema.post('save', function (doc, next) {
    console.log(chalk.green("New User is Created :", doc))
    next();
})

//login
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

const User = mongoose.model('user', userSchema);

module.exports = User;

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    googleId: String,
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide email']
    },
    password: {
        type: String,
        required: [true, 'Please provide password']
    },
    fname: {
        type: String,
        default: "default",
    },
    lname: {
        type: String,
        default: "default",
    },
    faculty: {
        type: String,
        default: "default"
    },
    branch: {
        type: String,
        default: "default"
    },
    img: {
        type: String,
        default: 'https://secure.gravatar.com/avatar/0d36b4ae4b9c67a2b162710923f792ed?s=35&amp;d=identicon'
    },
    role: {
        type: String,
    },
    teacher: {
        type: mongoose.Schema.ObjectId,
        ref: 'teacher'
    },
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'Student'
    },
    deleted_at: {
        type: Date,
        default: null,
    },
}, 
{ timestamps: true })

userSchema.pre('save', function(next) {
    const user = this

    // const validDomains = /@(kkumail\.com|kku\.ac\.th)$/i; 

    // if (!validDomains.test(user.email)) {
    //     return next(new Error('Invalid email domain. Only kkumail.com and kku.ac.th are allowed.'));
    // }

    bcrypt.hash(user.password, 10).then(hash => {
        user.password = hash
        next()
    }).catch(error => {
        console.error(error);
    })
})
const User = mongoose.model('User', userSchema);

module.exports = User;
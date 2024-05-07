const User = require('../models/user.model');

module.exports = (req,res, next) => {
    User.findById(req.session.userId).then((user) => {
        if (!user) {
            return res.redirect('/');
        } else if (user && user.role == "student") {
            next();
        } else if (user && user.role == "teacher") {
            return res.redirect('/adminIndex');
        }

    }).catch(error => {
        console.error(error)
    })
};
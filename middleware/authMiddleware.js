const User = require('../models/user.model');

module.exports = (req,res, next) => {
    User.findById(req.session.userId).then((user) => {
        if (!user) {
            return res.redirect('/adminIndex');
        }
        next();
    }).catch(error => {
        console.error(error)
    })
};
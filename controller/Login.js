
var User = require('../models/user.model')
var bcrypt = require('bcrypt')
var Student = require('../models/student.model')
var Teacher = require('../models/teacher.model')
const Lesson = require("../models/Lessons");

var SchoolYear = require('../models/schoolYear')

const ifNotLoggedIn = async (req, res, next) => {

    let email = "";
    let password = "";
    let data = req.flash('data')[0]

    if (typeof data != "undefined") {
        email = data.email;
        password = data.password;
    }

    res.render('LoginPage', {
        errors: req.flash('validationErrors'),
        email: email,
        password: password
    });
};

const loginPage = async (req, res) => {
    try {

        const { email, password } = req.body;
        const kkumailRegex = /@kkumail\.com$/;
        const gmailRegex = /@gmail\.com$/;

        const user = await User.findOne({ email });

        if (user) {
            const match = await bcrypt.compare(password, user.password);
            const getRole = user.role;
            if (match && getRole == "teacher") {
                req.session.userId = user.id;
                // const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
                // const getLessonId = req.query.lessonId;
                // const lesson = await Lesson.findById(getLessonId);
                return res.redirect('/adminIndex');
            } else {
                return res.redirect('/login');
            }
        } else if (!user && gmailRegex.test(email)) {
            const teacher = "teacher";
            const createUser = new User({
                email,
                password,
                role: teacher
            });
            await createUser.save();

            const createTeacher = new Teacher({
                user: createUser._id
            });
            await createTeacher.save();
            const updateUser = await User.findByIdAndUpdate(
                { _id: createUser._id },
                {
                    $push: {
                        teacher: createTeacher._id
                    }
                },
                { new: true }
            );

            const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
            const getLessonId = req.query.lessonId;
            const lesson = await Lesson.findById(getLessonId);
            const getUser = await User.findById(createUser._id);
            return res.render('adminIndex', { lessons, lesson });
        } else if (!user && kkumailRegex.test(email)) {
            const student = "student";
            const createUser = new User({
                email,
                password,
                role: student
            });
            await createUser.save();

            const getUser = await User.findById(createUser._id);
            // console.log("Login successful");
            // res.json(createUser);
            res.render('studentInformation', { getUser });

        }

    } catch (err) {
        console.error(err);
        if (err) {
            const validationErrors = Object.keys(err.errors).map(key => err.errors[key].message);
            req.flash('validationErrors', validationErrors)
            req.flash('data', req.body)
        }
        return res.redirect('/login')
    }
}

const saveInfoStudent = async (req, res) => {
    try {

        const { userId, email, studentId, schoolYear,
            fname, lname, faculty, branch, yearLevel
        } = req.body;

        const updateUser = await User.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    fname: fname,
                    lname: lname,
                    faculty: faculty,
                    branch: branch
                }
            }
        );

        const findSchoolYear = await SchoolYear.findOne({ schoolYear });

        if (findSchoolYear) {
            const createStudent = new Student({
                studentId,
                yearLevel,
                user: userId,
                schoolYear: findSchoolYear._id
            })
            await createStudent.save();

            const pushStdId = await User.findOneAndUpdate(
                { _id: userId },
                {
                    $push: {
                        student: createStudent._id
                    }
                },
                { new: true }
            );

        } else if (!findSchoolYear) {
            const getYear = findSchoolYear.schoolYear
            const createSchoolYear = new SchoolYear({
                schoolYear: getYear
            })
            await createSchoolYear.save();

            const createStudent = new Student({
                studentId,
                yearLevel,
                user: userId,
                schoolYear: createSchoolYear._id
            })
            await createStudent.save();

            const pushStdId = await User.findOneAndUpdate(
                { _id: userId },
                {
                    $push: {
                        student: createStudent._id
                    }
                },
                { new: true }
            );
        }

        res.send('created');
    } catch (err) {
        console.error(err);
        if (err) {
            const validationErrors = Object.keys(err.errors).map(key => err.errors[key].message);
            req.flash('validationErrors', validationErrors)
            req.flash('data', req.body)
        }
        return res.redirect('/login')
    }
}

const logout = async (req, res) => { 
    try {
        req.session.destroy(() => {
            res.redirect('/')
        })
    } catch (error) {
        console.error(error)
    }
}


module.exports = {
    ifNotLoggedIn,
    loginPage,
    saveInfoStudent,
    logout
};
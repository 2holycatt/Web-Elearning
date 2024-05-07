
var User = require('../models/user.model')
var bcrypt = require('bcrypt')
var Student = require('../models/student.model')
var Teacher = require('../models/teacher.model')
const Lesson = require("../models/Lessons");

var SchoolYear = require('../models/schoolYear')

const axios = require('axios');
const YOUR_CLIENT_ID = '24763268362-repsshdr1kg3btst8om00g7h91hnal0u.apps.googleusercontent.com'
const YOUR_CLIENT_SECRET = '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'
const YOUR_REDIRECT_URL = 'http://localhost:4000/auth/google/callback'

const authGoogle = async (req, res) => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${YOUR_CLIENT_ID}&redirect_uri=${YOUR_REDIRECT_URL}&response_type=code&scope=profile email`;
    res.redirect(url);
};

const authGoogleCallback = async (req, res) => {
    const { code } = req.query;
    try {
        const { data } = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: YOUR_CLIENT_ID,
            client_secret: YOUR_CLIENT_SECRET,
            code,
            redirect_uri: YOUR_REDIRECT_URL,
            grant_type: 'authorization_code',
        });
        const { access_token, id_token } = data;
        const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        console.log(profile);

        const kkumailRegex = /@kkumail\.com$/;
        const gmailRegex = /@gmail\.com$/;

        const getUser = profile;
        const getEmail = getUser.email

        console.log("นี่คือ email จาก Profile: " + getEmail);
        const user = await User.findOne({ email: getEmail });
        console.log(user);
        if (user) {
            const getRole = user.role;
            if (getRole == "teacher") {
                req.session.userId = user.id;
                // const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
                // const getLessonId = req.query.lessonId;
                // const lesson = await Lesson.findById(getLessonId);
                return res.redirect('/adminIndex');
            } else if (getRole == "student") {
                req.session.userId = user.id;
                return res.redirect('/studentIndex');
            }
        } else if (!user && gmailRegex.test(getEmail)) {
            const teacher = "teacher";
            const createUser = new User({
                email: getEmail,
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
            const userData = await User.findById(createUser._id);
            return res.render('adminIndex', { lessons, lesson, userData });
        } else if (!user && kkumailRegex.test(getEmail)) {
            const student = "student";
            const createUser = new User({
                email: getEmail,
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
        // if (err) {
        //     const validationErrors = Object.keys(err.errors).map(key => err.errors[key].message);
        //     req.flash('validationErrors', validationErrors)
        //     req.flash('data', req.body)
        // }
        return res.redirect('/')
    }
};

const logoutGoogle = (req, res) => {
    try {
        // สร้าง URL สำหรับล็อกเอาท์ออกจากระบบ Google
        const logoutUrl = `https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=${YOUR_REDIRECT_URL}`;
        req.session.destroy();
        // ทำการลบคุกกี้ที่เกี่ยวข้องกับการเข้าสู่ระบบด้วย Google (ถ้ามี)
        res.clearCookie('google_access_token');
        res.clearCookie('google_id_token');

        // ลิ้งค์ไปยัง URL สำหรับล็อกเอาท์
        res.redirect(logoutUrl);
    } catch (error) {
        console.error(error)
    }
};

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

// const loginPage = async (req, res) => {
//     try {

//         // const { email, password } = req.body;
//         const kkumailRegex = /@kkumail\.com$/;
//         const gmailRegex = /@gmail\.com$/;

//         const user = await User.findOne({ email });

//         if (user) {
//             const match = await bcrypt.compare(password, user.password);
//             const getRole = user.role;
//             if (match && getRole == "teacher") {
//                 req.session.userId = user.id;
//                 // const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
//                 // const getLessonId = req.query.lessonId;
//                 // const lesson = await Lesson.findById(getLessonId);
//                 return res.redirect('/adminIndex');
//             } else {
//                 return res.redirect('/login');
//             }
//         } else if (!user && gmailRegex.test(email)) {
//             const teacher = "teacher";
//             const createUser = new User({
//                 email,
//                 password,
//                 role: teacher
//             });
//             await createUser.save();

//             const createTeacher = new Teacher({
//                 user: createUser._id
//             });
//             await createTeacher.save();
//             const updateUser = await User.findByIdAndUpdate(
//                 { _id: createUser._id },
//                 {
//                     $push: {
//                         teacher: createTeacher._id
//                     }
//                 },
//                 { new: true }
//             );

//             const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
//             const getLessonId = req.query.lessonId;
//             const lesson = await Lesson.findById(getLessonId);
//             const getUser = await User.findById(createUser._id);
//             return res.render('adminIndex', { lessons, lesson });
//         } else if (!user && kkumailRegex.test(email)) {
//             const student = "student";
//             const createUser = new User({
//                 email: getUser.email,
//                 role: student
//             });
//             await createUser.save();

//             const getUser = await User.findById(createUser._id);
//             // console.log("Login successful");
//             // res.json(createUser);
//             res.render('studentInformation', { getUser });

//         }

//     } catch (err) {
//         console.error(err);
//         if (err) {
//             const validationErrors = Object.keys(err.errors).map(key => err.errors[key].message);
//             req.flash('validationErrors', validationErrors)
//             req.flash('data', req.body)
//         }
//         return res.redirect('/login')
//     }
// }

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
            const createSchoolYear = new SchoolYear({
                schoolYear: schoolYear
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

// const logout = async (req, res) => {
//     try {
//         req.session.destroy(() => {
//             res.redirect('/')
//         })
//     } catch (error) {
//         console.error(error)
//     }
// }


module.exports = {
    ifNotLoggedIn,
    saveInfoStudent,
    authGoogle,
    authGoogleCallback,
    logoutGoogle
};
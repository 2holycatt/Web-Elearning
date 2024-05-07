require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const { MongoClient, GridFSBucket } = require('mongodb');
const flash = require('connect-flash')
const session = require("express-session")
const { body, validatorResult } = require('express-validator');
const cookieSession = require("cookie-session")
const fetch = require("node-fetch");
const fs = require('fs');
var multer = require('multer');
const cors = require('cors');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const authRouter = require('./routes/auth');


const app = express();

app.locals.pluralize = require('pluralize');


const storage = multer.memoryStorage(); // หรือใช้ storage ที่เก็บไฟล์ในแฟ้ม

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 * 100 }, // เพิ่มขนาดไฟล์ที่ใหญ่ขึ้น เช่น 100 MB
// });
// const uploadsFolder = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadsFolder)) {
//     fs.mkdirSync(uploadsFolder);
// }

const xlsx = require('xlsx');
const upload = multer({ dest: 'uploads/' });

const Layout1 = require('./models/Layout1');
const Layout2 = require('./models/Layout2');
const Layout3 = require('./models/Layout3');
const Layout4 = require('./models/Layout4');
const Lesson = require('./models/Lessons');
// const addAthlete = require('./models/AthleteOat')
// const addEvent = require('./models/Event')
// // const addMatch = require('./models/Match')
// const addTeam = require('./models/Team')

// const addMatch = require('./models/EventOat')


const Router = require('./routes/Router.js');
const manageStudent = require('./controller/manageStudent.js');
// Middleware
// const signInMiddleware = require("./middleware/signInMiddleware")
// const adminMiddleware = require("./middleware/adminMiddleware")

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))
app.use('/pdfs', express.static('uploads'));

// //session_middleware
// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/Elearning', collectionName: "session" }),
//     cookie: {
//         maxAge: 1000 * 60 * 60 * 24
//     }
// }));

app.use(flash());
app.use(session({
    secret: "ppw.smw_094",
    resave: true,
    saveUninitialized: true
}));

// custom middleware for login
const ifNotLoggedIn = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.render('LoginPage');
    }
    next();
}

app.get('/students', (req, res, next) => {
    res.render('studentInformation');
})
app.post('/upload', manageStudent.upload.single('excelFile'), manageStudent.uploadedFile);

// Middleware ที่เรียกในทุก request
app.use((req, res, next) => {
    // ตรวจสอบว่าผู้ใช้ล็อกอินหรือไม่
    if (req.isAuthenticated) {
        // ถ้าล็อกอินแล้ว, เรียก deserializeUser ของ Passport
        passport.deserializeUser(req.user, (err, user) => {
            if (err) {
                return next(err);
            }

            // อัพเดท req.user ด้วยข้อมูลล่าสุด
            req.user = user;
            next();
        });
    } else {
        // ถ้ายังไม่ล็อกอิน, ไปต่อไป
        next();
    }
});
app.use(cors());


const url = "mongodb://localhost:27017/Elearning";

mongoose.connect(url)
    .then(() => {
        console.log("Connected to MongoDB");
        // Start Express server หลังจากที่ MongoDB เชื่อมต่อเรียบร้อยแล้ว
        app.listen(4000, () => {
            console.log("Express server is running");
        });
    })
    .catch((err) => {
        console.error(err)
    })


global.loggedIn = null

app.use(passport.session());
// app.use('/', authRouter);
// app.use('/teacher', authRouter);
// app.use('/profile', authRouter);
app.use('/', Router)
app.use(multer().any());

app.use("*", (req, res, next) => {
    loggedIn = req.session.userId
    next()
})


app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
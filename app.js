if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const ejsMate = require('ejs-mate')
const path = require('path');
const passport = require('passport');
const methodOverride = require('method-override');
const MongoDBStore = require("connect-mongo");
const session = require('express-session');
const LocalStrategy = require('passport-local');
const Organization = require('./models/organization')
const mongoose = require('mongoose');

const sponsorsRoutes = require('./routes/sponsors');
const organizationRoutes = require('./routes/organizations');


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/hello';

mongoose.connect(dbUrl , {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.SECRET || 'thisisasecret';

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret: secret,
    touchAfter: 24 * 60 * 60
});

store.on('error', function(e) {
    console.log('SEssion Store Error', e);
})

const sessionConfig = {
    store,
    name: 'cooonect',
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Organization.authenticate()));

passport.serializeUser(Organization.serializeUser());
passport.deserializeUser(Organization.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentOrganization = req.organization;
    next();
})

app.use('/', organizationRoutes);
app.use('/sponsors', sponsorsRoutes);
// app.use('/sponsors/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

app.get('*', (req, res) => {
    res.send('Must be Typo!')
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!!';
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 2000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
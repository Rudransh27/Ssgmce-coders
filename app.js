const express = require('express');
const app = express();
const ejsMate = require('ejs-mate')
const path = require('path');
const passport = require('passport');


const sponsorsRoutes = require('./routes/sponsor');
// const reviewRoutes = require('./routes/reviews');
const organizationRoutes = require('./routes/organization');


app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.engine('ejs', ejsMate);

app.use('/', organizationRoutes);
app.use('/sponsors', sponsorsRoutes);
// app.use('/sponsors/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

app.get('*', (req, res) => {
    res.send('Must be Typo!')
})

app.listen(2000, () => {
    console.log('Heya!');
})
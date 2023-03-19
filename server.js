require('dotenv').config()
require('./config/passport')
const path = require('path');
const express = require('express');
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const methodOverride = require('method-override');
const app = express();
const db = require('./models');
const bathroomsRoute = require('./controllers/bathrooms');
const reviewsRoute = require('./controllers/reviews');
const liveReloadServer = livereload.createServer();
const session = require('express-session');
const passport = require('passport');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next()
})
const setUser = (req, res, next) => {
    req.user = res.locals.user;
    next()
}
app.use('/bathroom', setUser, bathroomsRoute)
app.use('/reviews', setUser, reviewsRoute)

app.get('/', (req, res) => {
   res.render('home')
})
app.get('/nearme', (req, res) => {
    res.render('nearme')
})
app.get('/search', (req, res) => {
    db.api.locate(req.query.q)
    .then(async data => {
        const center = {
            lat: data.results[0].geometry.location.lat,
            lng: data.results[0].geometry.location.lng
        }
        db.api.nearby(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng)
        .then(async results => {
            const coordinates = []
            for(let result of results.results) {
            const address = await db.api.reverseLocate(result.geometry.location.lat, result.geometry.location.lng)
            const rating = await db.Bathrooms.find({googleId: result.place_id})
            
            const loc = {
                lat: result.geometry.location.lat,
                lng: result.geometry.location.lng,
                name: result.name,
                id: result.place_id,
                address: address.results[0].formatted_address,
                rating: 0
            }
            if(rating.length > 0) {
                loc.rating = rating[0].totalRating
            }
            coordinates.push(loc)
            }
            res.render('search', {
            results: coordinates,
            center: center,
            })
        })
    })
})
app.get('/auth/google', passport.authenticate(
    'google',
    { scope: ['profile', 'email'] }
))
app.get('/oauth2callback', passport.authenticate(
    'google',
    {
        successRedirect: '/',
        failureRedirect: '/'
    }
))
app.get('/logout', function(req, res) {
    req.logout(function() {
        res.redirect('/')
    })
})
app.get('*', function (req, res) {
    res.render('404')
});
app.listen(process.env.PORT, function () {
    console.log('Express is listening to port', process.env.PORT);
});
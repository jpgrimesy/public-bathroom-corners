require('dotenv').config()
const path = require('path');
const express = require('express');
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const methodOverride = require('method-override');
const app = express();
const db = require('./models');
const bathroomsRoute = require('./controllers/bathrooms')
const reviewsRoute = require('./controllers/reviews')
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'))
app.use(connectLiveReload());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/bathroom', bathroomsRoute)
app.use('/reviews', reviewsRoute)

app.get('/', (req, res) => {
   res.render('index')
})
app.get('/index', (req, res) => {
    res.render('index')
})
app.get('/test', (req, res) => {
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
                    address: address.results[0].formatted_address
                }
                coordinates.push(loc)
               }
               res.render('search', {
                results: coordinates,
                center: center
               })
            })
        })
   
})
app.get('/seed', function (req, res) {
    db.Bathrooms.deleteMany({})
        .then(deletedProducts => {
            console.log(`Deleted ${deletedProducts.length} prodcuts`)

            db.Bathrooms.insertMany(db.seedBathrooms)
                .then(productsAdded => {
                    console.log(`Added ${productsAdded.length} things`)
                    res.json(productsAdded)
                })
        })
})

app.listen(process.env.PORT, function () {
    console.log('Express is listening to port', process.env.PORT);
});
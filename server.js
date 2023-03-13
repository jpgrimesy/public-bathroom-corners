require('dotenv').config()
const path = require('path');
const express = require('express');
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const methodOverride = require('method-override');
const app = express();
const db = require('./models');

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


app.get('/', (req, res) => {
   

    res.render('home', {
        
        lat: 33.965,
        lng: -109.644
    })
})
app.get('/test', (req, res) => {
    db.api.locate('8367%20forest%20park%2CChino%2CCA')
        .then(async data => {
            db.api.nearby(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng)
            .then(async results => {
               
               const coordinates = []
               for(let result of results.results) {
                const loc = {
                    lat: result.geometry.location.lat,
                    lng: result.geometry.location.lng
                }
                coordinates.push(loc)
               }
               res.render('search', {
                results: coordinates
               })
            })
        })
   
})


app.listen(process.env.PORT, function () {
    console.log('Express is listening to port', process.env.PORT);
});
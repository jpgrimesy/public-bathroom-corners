const express = require('express')
const router = express.Router()
const db = require('../models')
const bathroom = require('../models/bathroom')


router.get('/', (req, res) => {
    db.Bathrooms.find({})
        .then(results => res.json(results))
})
router.get('/:id', (req, res) => {
    db.Bathrooms.find({ googleId: req.params.id })
        .then(bathroom =>  {
            res.render('bathroom', {
                bathroom: bathroom[0]
            })
        })
        .catch(err => console.log(err))
})

router.post('/create/:id', (req, res) => {
    db.Bathrooms.find({ googleId: req.params.id })
        .then(result => {
            if(result.length === 0) {
                db.api.placeId(req.params.id)
        .then(async bathroom => {
            db.Bathrooms.create({
                name: bathroom.result.name,
                googleId: bathroom.result.place_id,
                address: bathroom.result.formatted_address
            })
            .then(() => res.redirect(`/bathroom/${req.params.id}`))
        })
            } else {
                res.redirect(`/bathroom/${req.params.id}`)
            }
        })
    .catch(err => console.log(err))
})
router.put('/update/:id', (req, res) => {
    db.Bathrooms.findById(req.params.id)
        .then(bathroom => {
            let average;
            let sum = 0
            for(let review of bathroom.reviews) {
                sum += review.avgRating
            }
            average = sum / bathroom.reviews.length
            db.Bathrooms.findByIdAndUpdate(
                bathroom.id,
                { totalRating: average },
                { new: true }
                ) .then (bathroom => res.redirect(`/bathroom/${bathroom.googleId}`))
        })
        .catch(err => console.log(err))

})

module.exports = router
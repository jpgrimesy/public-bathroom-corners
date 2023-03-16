const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/index/:id', (req, res) => {
    db.Bathrooms.findById(req.params.id)
        .then(bathroom => {
            res.render('reviews', {
                bathroom: bathroom
            })
        })
})

router.get('/full/:bathId/:reviewId', (req, res) => {
    db.Bathrooms.findById(req.params.bathId)
        .then(bathroom => {
            res.render('full-review', {
                review: bathroom.reviews.id(req.params.reviewId),
                id: bathroom.id
            })
        })
})

router.get('/new/:id', (req, res) => {
    db.Bathrooms.findById(req.params.id)
        .then(bathroom => {
            res.render('new-post', {
                bathroom: bathroom
            })
        })
        .catch(err => console.log(err))

})

router.post('/post/:id', (req, res) => {
    db.Bathrooms.findByIdAndUpdate(
        req.params.id,
        { $push: { reviews: req.body } },
        { new: true }
        ).then(async bathroom => {
                db.Bathrooms.findById(bathroom.id)
                .then(async bathroom => {
                    let average;
                    let sum = 0
                    for(let review of bathroom.reviews) {
                        sum += review.avgRating
                    }
                    average = sum / bathroom.reviews.length
                    db.Bathrooms.findByIdAndUpdate( 
                        req.params.id,
                        { totalRating: average },
                        { new: true }
                        ).then(bathroom => res.redirect('/bathroom/' + bathroom.googleId))
                })
         })
        .catch(err => console.log(err))
})

router.get('/edit-post/:bathId/:reviewId', (req, res) => {
    db.Bathrooms.findById(req.params.bathId)
        .then(bathroom => {
            res.render('edit-post', {
                review: bathroom.reviews.id(req.params.reviewId),
                id: bathroom.id,
                name: bathroom.name
            })
        })
}) 

router.put('/edit/:bathId/:reviewId', (req, res) => {
    const { reviewerName, title, cleanRating, privacyRating, amenityRating, content } = req.body;
    const newAverage = (parseInt(cleanRating) + parseInt(privacyRating) + parseInt(amenityRating)) / 3
    db.Bathrooms.findOneAndUpdate(
        { _id: req.params.bathId, 'reviews._id': req.params.reviewId },
        { '$set': { 'reviews.$.reviewerName': reviewerName, 'reviews.$.title': title, 'reviews.$.cleanRating': cleanRating, 'reviews.$.privacyRating': privacyRating, 'reviews.$.amenityRaing': amenityRating, 'reviews.$.content': content, 'reviews.$.avgRating': newAverage}},
        { new : true }
    )
    .then(async bathroom => {
        let average = 0;
        for(let review of bathroom.reviews) {
            average += review.avgRating
        }
        bathroom.totalRating = average / bathroom.reviews.length
        await bathroom.save();
        res.redirect(`/bathroom/${bathroom.googleId}`)
    })
    .catch(err => console.log(err))
})

router.delete('/delete/:bathId/:reviewId', (req, res) => {
    db.Bathrooms.findByIdAndUpdate(
        req.params.bathId,
        { $pull: { reviews: { _id: req.params.reviewId }}},
        { new: true }
        )
    .then(async bathroom => {
        let average = 0;
        for(let review of bathroom.reviews) {
            average += review.avgRating
        }
        bathroom.totalRating = average / bathroom.reviews.length
        await bathroom.save();
        res.redirect(`/bathroom/${bathroom.googleId}`)
    })
    .catch(err => console.log(err))
})

module.exports = router
const express = require('express')
const router = express.Router()
const db = require('../models')
const bathroom = require('../models/bathroom')

const ensureLoggedIn = (req, res, next) => {
    if ( req.isAuthenticated() ) return next();
    res.redirect('/auth/google');
}

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

router.get('/new/:id', ensureLoggedIn, (req, res) => {
    db.Bathrooms.findById(req.params.id)
    .then(bathroom => {
        res.render('new-post', {
            bathroom: bathroom
        })
    })
    .catch(err => console.log(err))
})

router.post('/post/:id', ensureLoggedIn, (req, res) => {
    db.Bathrooms.findByIdAndUpdate(req.params.id)
    .then(async bathroom => {
        req.body.user = req.user._id;
        req.body.userName = req.user.name;
        bathroom.reviews.push(req.body);
        bathroom.save()
        db.Bathrooms.findById(req.params.id)
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

router.get('/edit-post/:bathId/:reviewId', ensureLoggedIn, (req, res) => {
    db.Bathrooms.findById(req.params.bathId)
    .then(bathroom => {
        res.render('edit-post', {
            review: bathroom.reviews.id(req.params.reviewId),
            id: bathroom.id,
            name: bathroom.name,
            nickname: bathroom.nickname
        })
    })
}) 

router.put('/edit/:bathId/:reviewId', ensureLoggedIn, (req, res) => {
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

router.delete('/delete/:bathId/:reviewId', ensureLoggedIn, (req, res) => {
    db.Bathrooms.findByIdAndUpdate(
        req.params.bathId,
        { $pull: { reviews: { _id: req.params.reviewId }}},
        { new: true }
        )
    .then(async bathroom => {
        let average = 0;
        if(bathroom.reviews.length > 0) {
          for(let review of bathroom.reviews) {
                average += review.avgRating
            }
            bathroom.totalRating = average / bathroom.reviews.length  
        } else {
            bathroom.totalRating = average
        }
        
        await bathroom.save();
        res.redirect(`/bathroom/${bathroom.googleId}`)
    })
    .catch(err => console.log(err))
})

module.exports = router
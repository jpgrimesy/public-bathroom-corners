const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/:id', (req, res) => {
    db.findById(req.params.id)
        .then(reviews => {
            res.render('reviews', {
                reviews: reviews.reviews
            })
        })
})
router.post('/post/:id', (req, res) => {
    db.Bathrooms.findByIdAndUpdate(
        req.params.id,
        { $push: { reviews: req.body } },
        { new: true}
        )
            .then(async bathroom => {
                const total = await db.Bathrooms.findById(req.params.id)
                res.redirect('/bathroom/' + bathroom.googleId)
            })
            .catch(err => console.log(err))

})
module.exports = router
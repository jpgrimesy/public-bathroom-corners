const express = require('express')
const router = express.Router()
const db = require('../models')


router.get('/', (req, res) => {
    db.Bathrooms.find({})
        .then(results => res.json(results))
})
router.get('/:id', (req, res) => {
    db.Bathrooms.find({ googleId: req.params.id })
        .then(result =>  {
            
                res.json(result)
 
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
            // .then(info => res.json(info))
            .then(() => res.redirect(`/bathroom/${req.params.id}`))
        })
            } else {
                res.redirect(`/bathroom/${req.params.id}`)
            }
        })
    
        .catch(err => console.log(err))
})

module.exports = router
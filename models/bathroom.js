const mongoose = require('mongoose');
const reviewSchema = require('./review.js')
const bathroomSchema = new mongoose.Schema({
    name: String,
    photos: String,
    reviews: [reviewSchema],
    googleId: String,
    address: String
})

bathroomSchema.index({ googleId: 'text'})
module.exports = mongoose.model('Bathroom', bathroomSchema)
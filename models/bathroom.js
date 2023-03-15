const mongoose = require('mongoose');
const reviewSchema = require('./review.js')
const bathroomSchema = new mongoose.Schema({
    name: String,
    nickname: { type: String, default: '' },
    photos: String,
    reviews: [reviewSchema],
    googleId: String,
    address: String,
    totalRating: { type: Number, default: 0 }
})

bathroomSchema.index({ googleId: 'text'})
module.exports = mongoose.model('Bathroom', bathroomSchema)
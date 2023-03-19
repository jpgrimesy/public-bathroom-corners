const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    title: { type: String, required: true },
    cleanRating: Number,
    privacyRating: Number,
    amenityRating: Number,
    avgRating: { type: Number, default: function(){
        return (this.cleanRating + this.privacyRating + this.amenityRating) / 3
    }},
    content: { type: String, required: true },
    user: { type: mongoose.ObjectId, ref: 'User', required: true},
    userName: String
    },  
    { timestamps: true }
)

module.exports = reviewSchema
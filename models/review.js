const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewerName: { type: String, required: true },
    title: { type: String, required: true },
    cleanRating: Number,
    privacyRating: Number,
    amenityRating: Number,
    avgRating: { type: Number, default: function(){
        return (this.cleanRating + this.privacyRating + this.amenityRating) / 3
    }},
    content: { type: String, required: true },
    },  
    { timestamps: true }
)

module.exports = reviewSchema
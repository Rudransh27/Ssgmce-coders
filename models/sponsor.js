const mongoose = require('mongoose');
// const Review = require('./reviews')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

const opts = { toJSON: { virtuals: true } };

const SponsorSchema = new Schema({
    title: String,
    field1: String,
    field2: String,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Organization'
    },
    // reviews: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: 'Review'
    //     }
    // ]
}, opts)

SponsorSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Sponsor', SponsorSchema);
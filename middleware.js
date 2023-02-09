const ExpressError = require('./utils/ExpressError');
const sponsor = require('./models/sponsor'); 
// const Review = require('./models/reviews');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed In first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const sponsor = await sponsor.findById(id);
    if(!sponsor.author.equals(req.user._id)){
        return res.redirect(`/sponsors/${id}`);
    }
    next();
}

// module.exports.isReviewAuthor = async (req, res, next) => {
//     const { id, reviewId } = req.params;
//     const review = await Review.findById(reviewId);
//     if(!review.author.equals(req.user._id)){
//         req.flash('error', 'You do not have permission!')
//         return res.redirect(`/sponsors/${id}`);
//     }
//     next();
// }
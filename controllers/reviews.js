const Review = require('../models/reviews');
const Campground = require('../models/campground');

module.exports.createReviews = async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campground/${camp._id}`)
    // res.send(req.body.review)
}

module.exports.deleteReviews = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campground/${id}`);
}
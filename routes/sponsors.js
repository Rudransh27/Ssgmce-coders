const express = require('express');
const router = express.Router();

router.route('/')
    .get(async (req, res, next) => {
      const sponsors = await sponsor.find({});
      res.render('sponsors/index', { sponsors });
  })
    .post(async (req, res, next) => {
      const sponsor = new sponsor(req.body.sponsor);
      sponsor.author = req.user._id;
      await sponsor.save();
      console.log(sponsor);
      res.redirect(`sponsors/${sponsor._id}`)
  });

router.get('/new', (req, res) => {
  res.render('sponsors/new');
})

router.route('/:id')
    .get(async (req, res, next) => {
      const sponsor = await sponsor.findById(req.params.id).populate({
          path: 'reviews',
          populate: {
              path: 'author'
          }
      }).populate('author');
      if (!sponsor) {
          return res.redirect('/sponsors');
      }
      res.render('sponsors/show', { sponsor });
  })
    .delete(async (req, res, next) => {
      const { id } = req.params;
      await Campground.findByIdAndDelete(id);
      res.redirect('/campgrounds');
  })

module.exports = router;


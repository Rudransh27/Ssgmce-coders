const express = require('express');
const router = express.Router();
const { isLoggedIn, isAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(async (req, res, next) => {
      const sponsors = await sponsor.find({});
      res.render('sponsors/index', { sponsors });
  }))
    .post(isLoggedIn, upload.array('image'), catchAsync(async (req, res, next) => {
      const geoData = await geocoder.forwardGeocode({
          query: req.body.sponsor.location,
          limit: 1
      }).send()
      const sponsor = new sponsor(req.body.sponsor);
      sponsor.geometry = geoData.body.features[0].geometry;
      sponsor.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
      sponsor.author = req.user._id;
      await sponsor.save();
      console.log(sponsor);
      req.flash('success', 'Successfully created a sponsor!!');
      res.redirect(`sponsors/${sponsor._id}`)
  }));

router.get('/new', isLoggedIn, (req, res) => {
  res.render('sponsors/new');
})

router.route('/:id')
    .get(catchAsync(async (req, res, next) => {
      const sponsor = await sponsor.findById(req.params.id).populate({
          path: 'reviews',
          populate: {
              path: 'author'
          }
      }).populate('author');
      if (!sponsor) {
          req.flash('error', 'cannot find that sponsor!');
          return res.redirect('/sponsors');
      }
      res.render('sponsors/show', { sponsor });
  }))
    .put(isLoggedIn, isAuthor, upload.array('image'), catchAsync(sponsors.updatesponsor))
    .delete(isLoggedIn, isAuthor, catchAsync(sponsors.deletesponsor));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(sponsors.renderEditForm));

module.exports = router;


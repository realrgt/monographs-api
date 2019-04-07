const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const uploads = multer({ dest: 'uploads/docs' });

const Tester = require('../models/tester');

router.get('/', (req, res, next) => {
    Tester.find()
      .exec()
      .then(docs => {
          res.status(200).json(docs);
      })
      /*.then(result => {
        console.log(result);
        const response = {
            count: result.length,
            monographs: result.map(doc => {
                return {
                  _id: doc._id,
                  author: doc.author,
                  title: doc.title,
                  course: doc.course,
                  category: doc.category,
                  docFile: doc.docFile,
                  imgFile: doc.imgFile,
                  rating: doc.rating
                }
            })
        }
        res.status(200).json(response);
    })*/
      .catch(err => {
          console.log(err);
          res.status(500).json({ error: err });
      });
});

// Post a new monography
router.post('/', (req, res, next) => {

    console.log(req.files);

    const monography = new Monography({
        _id: new mongoose.Types.ObjectId(),
        author: req.body.author,
	    title: req.body.title,
        course: req.body.course,
        category: req.body.category,
        docFile: req.files['docFile'][0].path,
        imgFile: req.files['imgFile'][0].path,
        rating: req.body.rating
    });
    monography.save()
      .then(result => {
          console.log(result);
          res.status(201).json({
            message: 'Created Successfully!!',
            createdMonography: {
                _id: result._id,
                author: result.author,
		        title: result.title,
                course: result.course,
                category: result.category,
                docFile: result.docFile,
                imgFile: result.imgFile,
                rating: result.rating
            }
          });
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({ error: err });
      });

});

module.exports = router;
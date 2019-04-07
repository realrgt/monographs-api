const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, './uploads/docs');
        }

        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, './uploads/images');
        }
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        // TO BE CHANGED
        cb(new Error('The file has not been stored!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 3
    },
    fileFilter: fileFilter
});

const Monography = require('../models/monography');

// Code Refactoring vars
const uploadHandler = upload.fields([{ name: 'docFile' }, { name: 'imgFile' }]);

// Get all monographs
router.get('/', (req, res, next) => {
    Monography.find()
        .select('_id author title category rating course description docFile imgFile')
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

// Post a new monography
router.post('/', uploadHandler, (req, res, next) => {

    console.log(req.files);

    const monography = new Monography({
        _id: new mongoose.Types.ObjectId(),
        author: req.body.author,
	    title: req.body.title,
        course: req.body.course,
        category: req.body.category,
        description: req.body.description,
        docFile: req.files['docFile'][0].path,
        imgFile: req.files['imgFile'][0].path,
        rating: req.body.rating
    });
    monography.save()
      .then(result => {
          console.log(result);
          res.status(201).json(result);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({ error: err });
      });

});

// Updates a single monography
router.put('/:monographyId', uploadHandler, (req, res, next) => {
    const id = req.params.monographyId;
    Monography.updateOne({ _id: id }, {
        $set: {
            author: req.body.author,
	        title: req.body.title,
            course: req.body.course,
            category: req.body.category,
            description: req.body.description,
            docFile: req.files['docFile'][0].path,
            imgFile: req.files['imgFile'][0].path,
            rating: req.body.rating
        }
    })
      .exec()
      .then(result => {
          console.log(result);
          res.status(200).json({
            message: 'Updated successfully'
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

// Get Monography by Id
router.get('/:monographyId', (req, res, next) => {
    const id = req.params.monographyId;
    Monography.findById(id)
    .select('_id author title category rating course description docFile imgFile')
      .exec()
      .then(doc => {
          console.log(doc);
          if (doc) {
              res.status(200).json(doc);
          } else {
              res.status(404).json({
                message: 'No valid entry were found for provided ID!!'
              });
          }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

// Updates a single field (urlencoded or json needed, form-data not supported)
router.patch('/:monographyId', uploadHandler, (req, res, next) => {
    const id = req.params.monographyId;
    const updatedOps = {};
    for (const ops of req.body) {
        updatedOps[ops.propName] = ops.value;
    }
    Monography.updateOne({ _id: id }, { $set: updatedOps })
      .exec()
      .then(result => {
          console.log(result);
          res.status(200).json({
            message: 'Updated successfully',
            UpdatedMonography: updatedOps
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

// Removes Monography by ID
router.delete('/:monographyId', (req, res, next) => {
    const id = req.params.monographyId;
    Monography.deleteOne({ _id: id })
      .exec()
      .then(result => {
          console.log(result);
          res.status(200).json({
              message: 'Monography removed successfully'
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

module.exports = router;
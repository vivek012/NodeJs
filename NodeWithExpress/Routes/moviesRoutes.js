const express = require('express')
const moviesController = require('./../Controllers/moviesController')
const authController = require('./../Controllers/authController')

const router = express.Router()

// router.param('id', moviesController.checkId)

router.route('/highest-rated').get(moviesController.getHighestRatedMovies, moviesController.getAllMovies)

router.route('/movies-stats').get(moviesController.getMovieStats)

router.route('/movies-by-genre/:genre').get(moviesController.getMoviesByGenre)

router.route('/')
    .get(authController.protect, moviesController.getAllMovies)
    .post(authController.protect,  authController.restrict('admin'), moviesController.createMovie)

router.route('/:id')
    .get(moviesController.getMovies)
    .patch(moviesController.updateMovie)
    .delete(moviesController.deleteMovie)



module.exports = router;
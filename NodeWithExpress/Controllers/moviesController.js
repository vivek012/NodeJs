const Movie = require("./../Models/movieModel")
const ApiFeatures = require('../Utils/ApiFeatures')
const asyncErrorHandler = require('./../Utils/asyncErrorHandler')
const CustomError = require('./../Utils/CustomError')


// exports.validateBody = (req, res, next) => {
//     if (!req.body.name || !req.body.releaseYear){
//         return res.status(400).json({
//             status: "fail",
//             message: "Invalid movie data"
//         })
//     }
//     next();

// }

// exports.getHighestRated = (req, res, next)=>{
//     req.query.limit = 5;
//     req.query.sort = '-ratings'

//     next();
// }

exports.getHighestRatedMovies = async (req, res, next) => {
    try {
        const movies = await Movie.find().sort("-ratings").limit(5);

        res.status(200).json({
            status: "success",
            quantity: movies.length,
            data: { movies },
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err.message,
        });
    }
};

exports.getAllMovies = asyncErrorHandler(async (req, res, next) => {

        const features = new ApiFeatures(Movie.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();


        const movies = await features.query;

        // console.log(req.query);

        // // const excludeField = ['sort', 'page', 'field', 'limit'];
        // // const queryObj= {...req.query};
        // // excludeField.forEach((el)=>{
        // //     delete queryObj[el]
        // // })
        // // console.log(queryObj)






        res.status(200).json({
            status: "success",
            length: movies.length,
            data: {
                movies
            }
        })

    })


exports.getMovies = asyncErrorHandler(async (req, res, next) => {
        //  const movies = await Movie.find({_id: req.params.id});
        const movie = await Movie.findById(req.params.id);

        if(!movie){
            const error = new CustomError("Movie with that ID is not Found", 404)
            return next(error);
        }

        res.status(200).json({
            status: "success",
            data: {
                movie
            }
        })



})

exports.createMovie = asyncErrorHandler(async (req, res,next) => {

        const movie = await Movie.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                movie
            }
        })
})


exports.updateMovie = asyncErrorHandler(async (req, res, next) => {
        const updatedmovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

         if(!updatedmovie){
            const error = new CustomError("Movie with that ID is not Found", 404)
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            data: {
                movie: updatedmovie
            }
        })


})



exports.deleteMovie = asyncErrorHandler(async (req, res, next) => {

       const deletedMovie =  await Movie.findByIdAndDelete(req.params.id)

        if(!deletedMovie){
            const error = new CustomError("Movie with that ID is not Found", 404)
            return next(error);
        }

        res.status(204).json({
            status: 'success',
            data: null

        })


})

exports.getMovieStats = asyncErrorHandler(async (req, res, next) => {
        const stats = await Movie.aggregate([
            { $match: { releaseDate: { $lte: new Date() } } },
            { $match: { ratings: { $gte: 4.5 } } },
            {
                $group: {
                    _id: '$releaseYear',
                    avgRating: { $avg: '$ratings' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                    PriceTotal: { $sum: '$price' },
                    movieCount: { $sum: 1 }

                }
            },
            { $sort: { minPrice: 1 } },
            // {$match:{ maxPrice: {$gte : 60}}}
        ]);


        res.status(200).json({
            status: 'success',
            count: stats.length,
            data: {
                stats
            }
        })


})

exports.getMoviesByGenre = asyncErrorHandler(async (req, res, next) => {
  

        const genre = req.params.genre;
        const movies = await Movie.aggregate([
            { $unwind: '$genres' },
            {
                $group: {
                    _id: '$genres',
                    movieCount: { $sum: 1 },
                    movies: { $push: '$name' },
                }
            },
            { $addFields: { genre: "$_id" } },
            { $project: { _id: 0 } },
            { $sort: { movieCount: -1 } },
            // {$limit: 6},
            { $match: { genre: genre } },
        ])

        res.status(200).json({
            status: 'success',
            count: movies.length,
            data: {
                movies
            }
        })


})
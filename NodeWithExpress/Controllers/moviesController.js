
const Movie = require("./../Models/movieModel")
const ApiFeatures = require('../Utils/ApiFeatures')


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

exports.getHighestRatedMovies = async (req, res) => {
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

exports.getAllMovies = async (req, res) => {
    try {
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

    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err.message
        })

    }
}


exports.getMovies = async (req, res) => {

    try {
        //  const movies = await Movie.find({_id: req.params.id});
        const movie = await Movie.findById(req.params.id);

        res.status(200).json({
            status: "success",
            data: {
                movie
            }
        })

    } catch (err) {
        res.status(404).json({
            status: "fail;",
            message: err.message
        })

    }

}

exports.createMovie = async (req, res) => {
    // const  testMovie = new Movie({})
    // testMovie.save()

    try {
        const movie = await Movie.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                movie
            }
        })

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }

}


exports.updateMovie = async (req, res) => {
    try {
        const updatedmovie = await Movie.findByIdAndUpdatea(req.param.id, req.body, { new: true, runValidator: true })

        res.status(200).json({
            status: 'success',
            data: {
                movie: updatedmovie
            }
        })

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}



exports.deleteMovie = async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id)

        res.status(204).json({
            status: 'success',
            data: null

        })

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.getMovieStats = async (req,res)=> {
    try{
        const stats = await Movie.aggregate([
            {$match:{ releaseDate: {$lte : new Date()}}},
            { $match: {ratings: {$gte:4.5}}},
            { $group: {
                _id: '$releaseYear',
                avgRating: {$avg: '$ratings'},
                avgPrice:{$avg: '$price'},
                minPrice:{$min: '$price'},
                maxPrice:{$max: '$price'},
                PriceTotal:{$sum: '$price'},
                movieCount: {$sum: 1}
                
            }},
            {$sort:{minPrice:1}},
            // {$match:{ maxPrice: {$gte : 60}}}
        ]);

        
        res.status(200).json({
            status: 'success',
            count: stats.length,
            data: {
                stats
            }
        })

    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.getMoviesByGenre = async (req, res)=>{
    try{

        const genre = req.params.genre;
        const movies = await Movie.aggregate([
            {$unwind: '$genres'},
            {$group: {
                _id :'$genres',
                movieCount: {$sum: 1},
                movies: {$push: '$name'},
            }},
            {$addFields: {genre: "$_id"}},
            {$project: {_id: 0}},
            {$sort: {movieCount: -1}},
            // {$limit: 6},
            {$match: {genre: genre}},
        ])

        res.status(200).json({
            status: 'success',
            count: movies.length,
            data: {
                movies
            }
        })

    }catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}
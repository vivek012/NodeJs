
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
        const features = new ApiFeatures(Movie.find(), req.query).filter().sort().limitFields().paginate();
        const movies = await features.query;

        // console.log(req.query);

        // // const excludeField = ['sort', 'page', 'field', 'limit'];
        // // const queryObj= {...req.query};
        // // excludeField.forEach((el)=>{
        // //     delete queryObj[el]
        // // })
        // // console.log(queryObj)

        // //  NOT WORKING *****************************************
        // let queryStr = JSON.stringify(req.query);
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        // const queryObj = JSON.parse(queryStr);
        // console.log(queryObj);
        // if (req.query.sort || req.query.fields || req.query.limit || req.query.page) {
        //     delete queryObj.sort;
        //    delete  queryObj.fields;
        //    delete queryObj.limit;
        //    delete queryObj.page;
        // }
      
        


        // let query = Movie.find(queryObj);
    
        // let query = Movie.find().sort({price: 1})
        // console.log(query)

       // SORTING LOGIC *****************************
        // if (req.query.sort) {
        //     const sortBy = req.query.sort.split(',').join(' ')
        //     query = query.sort(sortBy) 
        // }else{
        //     query = query.sort('-createdAt') 

        // }

        // Limiting fields *****************************
        // if (req.query.fields){
        //     const fields = req.query.fields.split(',').join(' ')
        //     console.log(fields);
        //     query = query.select(fields)
        //     console.log(query)
        // }else{
        //     query = query.select('-__v')
        // }


        // // PAGINATION LOGIC*************************
        // const page = req.query.page*1 || 1;
        // const limit = req.query.limit || 10;
        // const skip = (page-1)* limit
        // query= query.skip(skip).limit(limit)

        //     if(req.query.page){
        //         const movieCount = await Movie.countDocuments()
        //         if(skip >= movieCount){
        //             throw new Error("this page is not found")
        //         }
        //     }

        // const movies = await query;
        // console.log(movies)
        // find({duration : {$gte : 120}, ratings: {$gte: 6.5 }, Price: {$lte:100}})


        // const movies = await Movie.find() 
        //         .where('duration')
        //         .equals(req.query.duration)
        //         .where('ratings')
        //         .equals(req.query.ratings);


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
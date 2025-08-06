
const Movie = require("./../Models/movieModel")



// exports.validateBody = (req, res, next) => {
//     if (!req.body.name || !req.body.releaseYear){
//         return res.status(400).json({
//             status: "fail",
//             message: "Invalid movie data"
//         })
//     }
//     next();

// }

exports.getAllMovies = async (req, res) => {
    try {

        console.log(req.query);

        // const excludeField = ['sort', 'page', 'field', 'limit'];
        // const queryObj= {...req.query};
        // excludeField.forEach((el)=>{
        //     delete queryObj[el]
        // })
        // console.log(queryObj)


       let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    const queryObj = JSON.parse(queryStr);

    console.log(queryObj); // Check converted query

    const movies = await Movie.find(queryObj);
        
        // const movies = await Movie.find(req.query);
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
    try{
       const updatedmovie = await Movie.findByIdAndUpdatea(req.param.id,req.body, {new: true, runValidator: true} )

       res.status(200).json({
        status: 'success',
        data:{
            movie:updatedmovie
        }
       })

    }catch(err){
        res.status(404).json({
            status:'fail',
            message: err.message
        })

    }

}


exports.deleteMovie = async(req, res) => {
    try{
        await Movie.findByIdAndDelete(req.params.id )

       res.status(204).json({
        status: 'success',
        data:null
        
       })

    }catch(err){
         res.status(404).json({
            status:'fail',
            message: err.message
        })
    }
}
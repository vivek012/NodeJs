const mongoose = require("mongoose")


const movieSchema = new mongoose.Schema({
    name : {
        type : String, 
        required: [true, "Name is required field"],
        unique: true,
        trim: true
    }, 
    description:  {
        type : String, 
        required: [true, "Description is required field"],
        trim: true
    },
    duration:{
        type: Number,
        required: [true, 'Duration is required field']
    },
    ratings: {
        type:Number,
    },
    totalRating:{
        type: Number
    },
    releaseYear:{
        type: Number,
        required: [true, 'Release year is required field']
    },
    releaseDate:{
        type: Date,
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    genres:{
        type:[String],
        required: [true, 'Directors is required field!']
    },
    actors:{
        type: [String],
        require: [true, 'actors is a required field']
    },
    price:{
        type:Number,
        require: 'price is a required field'
    }
})

const Movie = mongoose.model('movie', movieSchema);

module.exports = Movie;
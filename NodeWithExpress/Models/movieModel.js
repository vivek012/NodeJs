const mongoose = require("mongoose")
const fs = require('fs')

const movieSchema = new mongoose.Schema({
    name : {
        type : String, 
        required: [true, "Name is required field"],
        unique: true,
        maxlength: [100,"Moview name must not have more than 100 characters"],
        minlength: [4, "movie name must have at least 4 characters"],
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
        default: Date.now(),
        select: false
    },
    genres:{
        type:[String],
        required: [true, 'Directors is required field!']
    },
    actors:{
        type: [String],
        required: [true, 'actors is a required field']
    },
    price:{
        type:Number,
        required: 'price is a required field'
    },
    createdBy : String
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
}
);


// EXECUTING BEFORE THE DOCUMENT IS SAVED IN DB 
// .Save or .create()
// insertMany , findByIdAndUpdate will not work 
movieSchema.pre('save', function(){
   this.createdBy = 'VivekKUMAR'
})

movieSchema.post('save', function(doc, next){
    const content = `A new movie document with name ${doc.name} has been created by ${doc.createdBy}\n `
    fs.writeFileSync('./Log/log.txt',content , {flag: 'a'}, (err)=>{
        console.log(err.message);
    } )
    next();
})

movieSchema.virtual('durationInHour').get(function(){
     return this .duration/60;
})

movieSchema.pre(/^find/, function(next){
    this.find({releaseDate: {$lte: Date.now()}})
    this.startTime = Date.now()
    next();

})

movieSchema.post(/^find/, function(docs, next){
    this.find({releaseDate: {$lte: Date.now()}})
    this.endTime = Date.now();

    const content = `Query too ${this.endTime - this.startTime} milliseconds to fetch document`
    fs.writeFileSync('./Log/log.txt',content , {flag: 'a'}, (err)=>{
        console.log(err.message);
    } )

    next();

})

movieSchema.pre('aggregate', function(next){
    console.log(this.pipeline().unshift({ $match : {releaseDate: {$lte :new Date()}}}))
    next()
})


const Movie = mongoose.model('movie', movieSchema);

module.exports = Movie;
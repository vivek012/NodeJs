// IMPORT PACKAGE 
const express = require('express')
const movieRouter = require('./Routes/moviesRoutes')
const morgan = require("morgan")

let app = express();

const logger = function (req, res, next){
    console.log("custom middleware called");
    next();
}

app.use(express.json());      


if (process.env.NODE_ENV === 'development') {
     app.use(morgan('dev'))
   console.log('App is running in development mode');
}
app.use(express.static('./public'))
app.use(logger);

app.use((req , res , next)=>{
    req.requestedAt = new Date().toISOString();
    next();
})


const qs = require("qs");
app.set("query parser", (str) => qs.parse(str)); // Override query parser

// ROUTE HANDLER FUNCTION **********************************

// app.get('/api/v1/movies', getAllMovies)
// app.get('/api/v1/movies/:id', getMovies)
// app.post('/api/v1/movies', createMovie)
// app.patch('/api/v1/movies/:id', updateMovie)
// app.delete('/api/v1/movies/:id', deleteMovie)

// USING THE ROUTES***************************
app.use('/api/v1/movies', movieRouter)

module.exports = app;
// IMPORT PACKAGE 
const express = require('express')
const morgan = require("morgan")
const rateLimit = require('express-rate-limit');
const helmet = require('helmet')
const sanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')

const movieRouter = require('./Routes/moviesRoutes')
const authRouter = require('./Routes/authRouter')
const userRouter = require('./Routes/userRouter')
const CustomError = require('./Utils/CustomError')
const globalErrorHandler = require('./Controllers/ErrorController')

let app = express();

app.use(helmet())

let limiter = rateLimit({
    max: 500,
    windowMs: 60*60 *1000,
    message: "We have received too many  requests from this IP . Please try after one hour ."
});

app.use('/api', limiter)

app.use(express.json({limit: '10kb'}));  

app.use(sanitize());
app.use(xss());
// console.log(process.env)   


if (process.env.NODE_ENV === 'development'){
     app.use(morgan('dev'))
   console.log('App is running in development mode');
}
app.use(express.static('./public'))




app.use((req , res , next)=>{
    req.requestedAt = new Date().toISOString();
    next();
})


const qs = require("qs");
app.set("query parser", (str) => qs.parse(str));

// ROUTE HANDLER FUNCTION **********************************

// app.get('/api/v1/movies', getAllMovies)
// app.get('/api/v1/movies/:id', getMovies)
// app.post('/api/v1/movies', createMovie)
// app.patch('/api/v1/movies/:id', updateMovie)
// app.delete('/api/v1/movies/:id', deleteMovie)

// USING THE ROUTES***************************
app.use('/api/v1/movies', movieRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);


app.use((req, res , next)=>{
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on the server`
    // })
// const err = new Error(`Can't find ${req.originalUrl} on the server`);
// err.status = 'fail';
// err.statusCode = 404; 
    const err = new CustomError(`Can't find ${req.originalUrl} on the server`,404)

    next(err);
})

app.use(globalErrorHandler)
module.exports = app;
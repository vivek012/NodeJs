const dotenv= require('dotenv')
dotenv.config({path: './config.env'})
const mongoose = require("mongoose")

process.on('uncaughtException',(err)=>{
    console.log(err.name, err.message);
    console.log('uncaughtException  occured! Shutting down...')

    server.close(()=>{
        process.exit(1);
    })
})
const app = require('./app')


//console.log(app.get('env'))
// console.log(process.env)

mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true 
}).then((conn)=>{
    // console.log(conn);
    console.log("Db connection Successful")
})


 
// CREATING A SERVER 
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
    console.log('SERVER HAS STARTED');
})

process.on('unhandledRejection',(err)=>{
    console.log(err.name, err.message);
    console.log('unhandled rejection occured! Shutting down...')

    server.close(()=>{
        process.exit(1);
    })
})





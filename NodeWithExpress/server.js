const dotenv= require('dotenv')
dotenv.config({path: './config.env'})

const mongoose = require("mongoose")
const app = require('./app')


//console.log(app.get('env'))
// console.log(process.env)

mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true 
}).then((conn)=>{
    // console.log(conn);
    console.log("Db connection Successful")
}).catch((error)=>{
    console.log("some error has occured")
})


 
// CREATING A SERVER 
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('SERVER HAS STARTED');
})
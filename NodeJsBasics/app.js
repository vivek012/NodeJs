//CORE MODULES
const readline = require("readline");
const fs = require("fs");
const http = require("http");
const url = require('url');
const events = require('events')

// CUSTOM OR USER DEFINED MODULES
const replaceHtml = require("./Modules/replaceHtml")
const user = require('./Modules/user')

// LECTURE 4****************************

// READING INPUTS AND WRITING OUTPUT

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout 
// });

// rl.question('please ente your name :', (name)=>{
//     console.log("You entered :",name);
//     rl.close();
// })

// rl.on('close', ()=>{
//     console.log("Interface closed")
//     process.exit(0);
// })

// LECTURE 5 ****************************

// READING AND WRITING to a FILE

// let textIn = fs.readFileSync("./files/input.txt", 'utf-8')
// console.log(textIn)

// let content = ` Data of input.txt file is : ${textIn} \nAt time ${new Date()}`

// fs.writeFileSync('./files/output.txt' , `${content}`)

// LECTURE 7 ****************************

// READING AND WRITING to a FILE asynchronously

// fs.readFile("./NodeJsBasics/files/start.txt", "utf-8", (err1, data1) => {
//   console.log(data1);
//   fs.readFile(`./NodeJsBasics/files/${data1}.txt`, "utf-8", (err2, data2) => {
//     console.log(data2);
//     fs.readFile("./NodeJsBasics/files/append.txt", "utf-8", (err3, data3) => {
//       console.log(data3);
//       fs.writeFile("./NodeJsBasics/files/output.txt", `${data2}\n${data3}\n At time ${new Date()} `,(err4, data4) => {
//           console.log("file written successfully");
//         });
//     });
//   });
// });

// console.log("reading files....");

// LECTURE 8 ****************************

// step 1 creating a server 


// const html = fs.readFileSync('./NodeJsBasics/files/Template/index.html', 'utf-8')
// let products = JSON.parse(fs.readFileSync("./NodeJsBasics/Data/product.json", 'utf-8'))
// let productListHtml = fs.readFileSync("./NodeJsBasics/files/Template/product-list.html", 'utf-8')
// let productDetailsHtml = fs.readFileSync("./NodeJsBasics/files/Template/product-details.html", 'utf-8')


// function replaceHtml(template, product) {
//     let output = template.replace("{{%IMAGE%}}", product.productImage);
//     output = output.replace("{{%NAME%}}", product.name);
//     output = output.replace("{{%MODELNAME%}}", product.modeName);
//     output = output.replace("{{%MODELNO%}}", product.modelNumber);
//     output = output.replace("{{%SIZE%}}", product.size);
//     output = output.replace("{{%CAMERA%}}", product.camera);
//     output = output.replace("{{%PRICE%}}", product.price);
//     output = output.replace("{{%COLOR%}}", product.color);
//     output = output.replace("{{%ID%}}", product.id);
//     output = output.replace("{{%ROM%}}", product.ROM);
//     output = output.replace("{{%DESC%}}", product.Description);

//     return output

// }
// const server = http.createServer((req, res) => {
//     let { query, pathname: path } = url.parse(req.url, true)
//     // console.log(x);
//     // let path = req.url

//     if (path === '/' || path.toLocaleLowerCase() === '/home') {
//         res.writeHead(200, {
//             'content-type': 'text/html',
//             'my-header': 'hello-world'
//         })
//         res.end(html.replace('{{%CONTENT%}}', productListHtml))
//     } else if (path.toLocaleLowerCase() === '/about') {
//         res.writeHead(200, {
//             'content-type': 'text/html',
//             'my-header': 'hello-world'
//         })
//         res.end(html.replace('{{%CONTENT%}}', 'You are in About page'))
//     } else if (path.toLocaleLowerCase() === '/contact') {
//         res.writeHead(200, {
//             'content-type': 'text/html',
//             'my-header': 'hello-world'
//         })
//         res.end(html.replace('{{%CONTENT%}}', "You are in contact page"))
//     } else if (path.toLocaleLowerCase() === '/products') {
//         if (!query.id) {
//             let productHtmlArray = products.map((prod) => {
//                 return replaceHtml(productListHtml, prod)
//             })
//             let productResponseHtml = html.replace('{{%CONTENT%}}', productHtmlArray.join(','))
//             res.writeHead(200, { 'content-type': 'text/html' });
//             res.end(productResponseHtml);
//         } else {
//             let prod = products[query.id]
//             let productDetailResponseHtml  = replaceHtml(productDetailsHtml,prod)
//             res.end(html.replace('{{%CONTENT%}}', productDetailResponseHtml));

//         }



//     } else {
//         res.writeHead(404, {
//             'content-type': 'text/html',
//             'my-header': 'hello-world'
//         })
//         res.end(html.replace('{{%CONTENT%}}', 'ERROR 404: PAGE NOT FOUND'))
//     }
// });


const server = http.createServer()

// server.on('request', (req, res)=>{
//     let { query, pathname: path } = url.parse(req.url, true)
//     // console.log(x);
//     // let path = req.url

//     if (path === '/' || path.toLocaleLowerCase() === '/home') {
//         res.writeHead(200, {
//             'content-type': 'text/html',
//             'my-header': 'hello-world'
//         })
//         res.end(html.replace('{{%CONTENT%}}', productListHtml))
//     } else if (path.toLocaleLowerCase() === '/about') {
//         res.writeHead(200, {
//             'content-type': 'text/html',
//             'my-header': 'hello-world'
//         })
//         res.end(html.replace('{{%CONTENT%}}', 'You are in About page'))
//     } else if (path.toLocaleLowerCase() === '/contact') {
//         res.writeHead(200, {
//             'content-type': 'text/html',
//             'my-header': 'hello-world'
//         })
//         res.end(html.replace('{{%CONTENT%}}', "You are in contact page"))
//     } else if (path.toLocaleLowerCase() === '/products') {
//         if (!query.id) {
//             let productHtmlArray = products.map((prod) => {
//                 return replaceHtml(productListHtml, prod)
//             })
//             let productResponseHtml = html.replace('{{%CONTENT%}}', productHtmlArray.join(','))
//             res.writeHead(200, { 'content-type': 'text/html' });
//             res.end(productResponseHtml);
//         } else {
//             let prod = products[query.id]
//             let productDetailResponseHtml  = replaceHtml(productDetailsHtml,prod)
//             res.end(html.replace('{{%CONTENT%}}', productDetailResponseHtml));

//         }



//     } else {
//         res.writeHead(404, {
//             'content-type': 'text/html',
//             'my-header': 'hello-world'
//         })
//         res.end(html.replace('{{%CONTENT%}}', 'ERROR 404: PAGE NOT FOUND'))
//     }

// })


server.listen(8000, '127.0.0.1', () => {
    console.log("server has started")
})


// Lecture 21 **************************************

// let myEmitter = new user();
// myEmitter.on('userCreated', (id , name)=>{
//     console.log(`A new user ${name} wITH ID ${id} is created!`)
// })

// myEmitter.on(`userCreated`, (id , name)=>{
//     console.log(`A new user ${name} with ID ${id} is addd to database!`)
// })

// myEmitter.emit('userCreated', 101, 'john');

// LECTURE 23 *******************************


// server.on('request', (req, res) => {
//     let rs = fs.createReadStream('./NodeJsBasics/files/large-file.txt');

//     rs.on('data', (chunk) => {
//         res.write(chunk)
//     })
//     rs.on('end', ()=>{
//         res.end();

//     })    

//     rs.on('error', (error) => {
//         res.end(error.message)
//     })
// })

// LECTURE 23 **************************

// USING PIPE METHOD  

// server.on('request', (req, res)=>{
//     let rs = fs.createReadStream('./NodeJsBasics/files/large-file.txt');
//     rs.pipe(res);

// })

// console.log("nodemon is working")

// LECTURE 29*******************************

console.log("program has Started")

// STORED IN  - 1ST PHASE 
setTimeout(()=>{
    console.log("Timer callback executed")
}, 0)

// STORED IN  - 2nd PHASE 
fs.readFile("./files/input.txt", ()=>{
    console.log('file read completed')
})

// STORED IN  - 3rd PHASE 
setImmediate(()=>{console.log("SetImmediate executed")})

console.log('Program has completed')
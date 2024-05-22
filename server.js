const express = require("express")
const server = express()
const path = require("path")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const cors = require("cors")
require("dotenv").config()
const multer = require("multer")
const PORT = process.env.PORT
const mongodb = require("mongodb")
const client = new mongodb.MongoClient(process.env.DB_URL)

// use the installed modules
server.use(cors())
server.use(bodyParser.urlencoded({extended: false}))
server.use(express.static(path.join(__dirname, "public")))

// set the template engine
server.set("view engine", "ejs")

// set up multer
const storage = multer.diskStorage({
    destination: function(request, file, cb){
        cb(null, "public/uploads")
    },
    filename: function(request, file, cb){
        cb(null, file.originalname)
    }
})
const uploads = multer({storage: storage})

server.get("/", (request, response, next)=>{
    response.render("home")
})


server.get("/register", (request, response, next)=>{
    response.render("register")
})


server.get("/login", (request, response, next)=>{
    response.render("login")
})



server.get("/upload", (request, response, next)=>{
    response.render("upload")
})
server.post("/upload", uploads.single("image"), async(request, response) => {
    const description = request.body.description
    const image = request.file.path
    const object = {
        description: description,
        image: image
    }
    try{
        const store = await client.db(process.env.DB_NAME).collection("uploads").insertOne(object)
        if(store)
        response.send({
            message: "upload successful",
            image_path: request.file.path
        })
    }catch(error){
        response.send({
            message: "upload not successful",
            code: "error",
            reason: error
        })
    }
    
})










server.listen(PORT, () => console.log(`server is listening on port ${PORT}`))
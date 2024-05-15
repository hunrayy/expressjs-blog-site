const express = require("express")
const server = express()
const path = require("path")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const cors = require("cors")
require("dotenv").config()
const PORT = process.env.PORT

// use the installed modules
server.use(cors())
server.use(bodyParser.urlencoded({extended: false}))
server.use(express.static(path.join(__dirname, "public")))

// set the template engine
server.set("view engine", "ejs")


server.use("/", (request, response, next)=>{
    if(request.method == "GET"){
        response.render("index")
    }
})










server.listen(PORT, () => console.log(`server is listening on port ${PORT}`))
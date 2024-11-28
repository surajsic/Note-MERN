//////notyouraverageguy86:tHiBNagqNpYQzsAi

require("dotenv").config();
const express= require("express");
var cors = require("cors");
const app = express();
const router = require("./router/auth-router")

const connectDb = require("./utils/db");

app.use(express.json());

app.use(
    cors({
        origin:"*",
    })
)

app.use("/api/auth", router)


const PORT = 8000;

connectDb().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running at ${PORT}`);
    }); 
})

module.exports = app;
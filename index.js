const express = require('express');
const app = express();
require('dotenv').config();
const connectDatabase = require("./config/database");
const bodyParser = require('body-parser');
const cors = require('cors');
const callRouter = require('./routes/callRouter')

// env files
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "config/config.env" });
}

//connecting mongoDB
connectDatabase()

//middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json());

//apis
app.use('/api/v1/call',callRouter)


app.get('*',(req,res)=>{
    res.send("Twilio call forwarding")
})

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


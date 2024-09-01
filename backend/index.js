require("dotenv/config");
const express = require("express");
const cors = require("cors");
const mainRouters = require('./routes/index');
const {dbConnection} = require("./db");


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/v1',mainRouters);

dbConnection().then(() => app.listen(3000)).catch(e=> console.log(e))


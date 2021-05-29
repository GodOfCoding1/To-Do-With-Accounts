const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const path = require("path");
const renderer = require("./server/services/render");

const connectDB = require("./server/database/connection");

const app = express();
//fixing
app.use(express.json({ limit: "1mb" }));

dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080;

//to log request
app.use(morgan("tiny"));

//connect to mongo
connectDB();

//adding body parser
app.use(bodyparser.urlencoded({ extended: true }));

//set view engine
app.set("view engine", "ejs");

//app.set("views", path.resolve(__dirname,"views/ejs"));

app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/img", express.static(path.resolve(__dirname, "assets/img")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));

//load router
app.use("/", require("./server/routes/router"));

app.listen(PORT, () => {
    console.log(`server started on http://localhost:${PORT}`);
});
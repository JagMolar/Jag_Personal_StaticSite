const express = require('express');
const app = express();
const path = require("path");

app.use(express.urlencoded({extended:false}));
app.use(express.json());//si conectamos con react o angular
app.use(require("./public/routes/index"));
app.use(express.static(path.join(__dirname, "public")));


app.listen(3500, ()=>{
    console.log("Server on port 3500");
});

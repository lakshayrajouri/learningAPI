import { error } from "console";
import ejs from "ejs"
import express from "express";
import https from "https";

const port = 3000;
const app = express();

var data ="";
var result;
const option_1 = {
    hostname : "api.wheretheiss.at",
    path : "/v1/satellites/25544",
    method : "GET"
};
const option_2 = {
    hostname : "bored-api.appbrewery.com",
    path : "/random",
    method : "GET"
};
var request;

app.use(express.static("public"));

app.use(express.urlencoded({extended:1}));

app.get("/", (req, res)=>{
    res.render("index.ejs");   
});

app.post("/submit", (req, res) => {
    request = https.request(option_2, (response) => {  
        response.on("data", (chunk)=>{
            data += chunk;
        });
        response.on("end", () => {
            try{
                result = JSON.parse(data);
                console.log(data); 
                res.render("index.ejs", {activity: result});
            }catch{
                //error handling
                console.error("failed to parse response:", error.message);
                res.status(500).send("failed to fetch activity. Please try again");
            }
        });
    });
    request.on("error", (error) => {
        console.error("failed to make requests:", error.message );
        res.status(500).send("failed to fetch activity, please try again");
    });
    request.end();
});

app.post("/sub", (req, res)=>{
    request = https.request(option_1, (response) => {  
        response.on("data", (chunk)=>{
            data += chunk;
        });
        response.on("end", () => {
            try{
                result = JSON.parse(data);
                console.log(data); 
                res.render("index.ejs", {iss: result});
            }catch{
                //error handling
                console.error("failed to parse response:", error.message);
                res.status(500).send("failed to fetch activity. Please try again");
            }
        });
    });
    request.on("error", (error) => {
        console.error("failed to make requests:", error.message );
        res.status(500).send("failed to fetch activity, please try again");
    });
    request.end();
});

app.listen(port, ()=> {
    console.log(`Server is running on PORT: ${port}`)
})
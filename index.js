import { error } from "console";
import ejs from "ejs"
import express from "express";
import https from "https";

const port = 3000;
const app = express();
const API = "https://api.wheretheiss.at/v1/satellites";

app.use(express.urlencoded({extended:1}));

app.get("/", (req, res)=>{
    const options = {
        hostname : "bored-api.appbrewery.com",
        path : "/random",
        method : "GET"
    };

    const request = https.request(options, (response) => {
        var data ="";
        response.on("data", (chunk)=>{
            data += chunk;
        });

        response.on("end", () => {
            try{
                const result = JSON.parse(data);
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

app.listen(port, ()=> {
    console.log(`Server is running on PORT: ${port}`)
})
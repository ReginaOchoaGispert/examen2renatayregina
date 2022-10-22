//const port = process.env.PORT | | 8000;
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("html", require("ejs").renderFile); //11.2k (gzipped: 4.2k)
app.set("view engine", "html");
const https = require("https");
const apiKey = "20603163275623904";
const url = "https://akabab.github.io/superhero-api/api/all.json";
const character_id = 1;
var indice = 1;

var objeto= [{
    Image: "",
    ID: "",
    Name: "",
    Full_Name: "",
    Powerstats_Intelligence: "",
    Powerstats_Strength: "",
    Powerstats_Speed: "",
    Powerstats_Durability: "",
    Powerstats_Power: "",
    Powerstats_Combat: "",
    Place_of_birth: "",
    Aliases: "",
    Gender: "",
    Race: "",
    Height: "",
    Weight: "",
    Eye_color: "",
    Hair_color: "",
    Group_affiliation: ""
}];

app.get("/",(req, res) =>{ 
        https.get(url, (response) => {
            let data = "";
            response
                .on("data", (jdata)=>{
                    data += jdata;
                })
                .on("end", () => {
                    var jsonData = JSON.parse(data);
                    for(let x = 0; x <= 562; x++){
                        objeto.push({
                            Image: jsonData[x].images["lg"],
                            ID: jsonData[x].id,
                            Name: jsonData[x].name,
                            Full_Name: jsonData[x].biography["full-name"],
                            Powerstats_Intelligence: jsonData[x].powerstats.intelligence,
                            Powerstats_Strength: jsonData[x].powerstats.strength,
                            Powerstats_Speed: jsonData[x].powerstats.speed,
                            Powerstats_Durability: jsonData[x].powerstats.durability,
                            Powerstats_Power: jsonData[x].powerstats.power,
                            Powerstats_Combat: jsonData[x].powerstats.combat,
                            Place_of_birth: jsonData[x].biography["place-of-birth"],
                            Aliases: jsonData[x].biography.aliases,
                            Gender: jsonData[x].appearance.gender,
                            Race: jsonData[x].appearance.race,
                            Height: jsonData[x].appearance.height,
                            Weight: jsonData[x].appearance.weight,
                            Eye_color: jsonData[x].appearance["eye-color"],
                            Hair_color: jsonData[x].appearance["hair-color"],
                            Group_affiliation: jsonData[x].connections["group-affiliation"]
                        })
                    }
                })
                .on("error",(e)=>{
                   console.log("Error ${e.message}");
                   res.send("Error ${e.message}");
                });   
        });
    res.sendFile(__dirname + "/public/html/index.html");

});

app.post("/",(req, res) =>{
    var info = req.body.info;
    var check = false;
    for (let x = 0; x<= 562; x++){
        if(info == objeto[x].Name){
            check = true;
            indice = x;
            res.render(__dirname + "/public/html/datos.html", {Objeto: objeto[x]});
        }
    }
    if(check == false){
        res.sendFile(__dirname + "/public/html/fail.html");
    }
});

app.get("/next",(req, res) =>{ 
    if(indice>=562){
        indice=0;
    }
    indice++;
    var info = objeto[indice].Name;
    var check = false;
    for (let x = 0; x<= 562; x++){
        if(info == objeto[x].Name){
            check = true;
            indice = x;
            res.render(__dirname + "/public/html/datos.html", {Objeto: objeto[x]});
        }
    }
    if(check == false){
        res.sendFile(__dirname + "/public/html/fail.html");
    }
});

app.get("/previous",(req, res) =>{ 
    if(indice==1){
        indice=563;
    }
    indice--;
    var info = objeto[indice].Name;
    var check = false;
    for (let x = 0; x<= 562; x++){
        if(info == objeto[x].Name){
            check = true;
            indice = x;
            res.render(__dirname + "/public/html/datos.html", {Objeto: objeto[x]});
        }
    }
    if(check == false){
        res.sendFile(__dirname + "/public/html/fail.html");
    }
});

app.get("/h",(req, res) =>{
    console.log(objeto);
});

app.listen(3000,(err) => {
    console.log("Listening on port 3000")
})
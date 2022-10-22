const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("html", require("ejs").renderFile); //11.2k (gzipped: 4.2k)
app.set("view engine", "html");
const https = require("https");
const apiKey = "2060316327493904";
const url = "https://www.superheroapi.com/api.php/"+apiKey;
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
    for (let x = 1; x<= 50; x++){
        https.get(url+"/"+x, (response) => {
            let data = "";
            response
                .on("data", (jdata)=>{
                    data += jdata;
                })
                .on("end", () => {
                    console.log(x, data)
                    var jsonData = JSON.parse(data);
                    objeto.push({
                        Image: jsonData.image.url,
                        ID: jsonData.id,
                        Name: jsonData.name,
                        Full_Name: jsonData.biography["full-name"],
                        Powerstats_Intelligence: jsonData.powerstats.intelligence,
                        Powerstats_Strength: jsonData.powerstats.strength,
                        Powerstats_Speed: jsonData.powerstats.speed,
                        Powerstats_Durability: jsonData.powerstats.durability,
                        Powerstats_Power: jsonData.powerstats.power,
                        Powerstats_Combat: jsonData.powerstats.combat,
                        Place_of_birth: jsonData.biography["place-of-birth"],
                        Aliases: jsonData.biography.aliases,
                        Gender: jsonData.appearance.gender,
                        Race: jsonData.appearance.race,
                        Height: jsonData.appearance.height,
                        Weight: jsonData.appearance.weight,
                        Eye_color: jsonData.appearance["eye-color"],
                        Hair_color: jsonData.appearance["hair-color"],
                        Group_affiliation: jsonData.connections["group-affiliation"]
                    })
                })
                .on("error",(e)=>{
                   console.log("Error ${e.message}");
                   res.send("Error ${e.message}");
                });   
        });
    }
    res.sendFile(__dirname + "/public/html/index.html");
});

app.post("/",(req, res) =>{
    var info = req.body.info;
    var check = false;
    for (let x = 0; x<= 50; x++){
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
    if(indice>=50){
        indice=0;
    }
    indice++;
    var info = objeto[indice].Name;
    var check = false;
    for (let x = 0; x<= 50; x++){
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
    if(indice==0){
        indice=50;
    }
    indice--;
    var info = objeto[indice].Name;
    var check = false;
    for (let x = 0; x<= 50; x++){
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
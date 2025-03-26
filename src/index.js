const express = require("express");
const app = express();
const fs = require("fs");
const mysql = require("mysql");

const dbInstance = mysql.createConnection({
    host : "localhost",
    user : "c20st17",
    password : "Fxe1gAywXT0Puskn",
    database : "c20st17"
});

app.use(express.static("public"));
// const path = require('path');
// const filePath = path.join(__dirname, 'public', 'page', 'musicPlayer.html');
app.use(express.json()); 

app.get('/',(req,res)=>{
    fs.readFile("./public/page/musicPlayer.html",'utf-8',(err,inData)=>{
        if(err) throw err;
        res.send(inData);
    })
});

app.get("/data",(req,res)=>{
    dbInstance.query("select * from music" ,(err , dataObj)=>{
        if(err) throw err;
        console.log(dataObj);
        res.json(dataObj);
    })
})

app.post("/like",(req,res)=>{
    // console.log(req.body.id);
    dbInstance.query("UPDATE music SET `like` = true WHERE id= ? ",[req.body.id],(err,changeObj)=>{
    if(err) {
        console.log(err);
        throw err;
    }
    // console.log("update successful :" , changeObj);
    });
    
    dbInstance.query("select * from music",(err,dataDB)=>{
        if(err) {
            console.log(err);
            throw err;
        }
        res.json(dataDB);
        });
});

app.post("/dontlike",(req,res)=>{
    // console.log(req.body.id);
    dbInstance.query("UPDATE music SET `like` = false WHERE id= ? ",[req.body.id],(err,changeObj)=>{
    if(err) {
        // console.log(err);
        throw err;
    }
    console.log("update successful :" , changeObj);
    });
    
    dbInstance.query("select * from music",(err,dataDB)=>{
        if(err) {
            console.log(err);
            throw err;
        }
        res.json(dataDB);
        });
});


app.listen(45170,()=>{
    console.log("45170 is ready")
});
// server/index.js
const path = require('path');

const express = require("express");

const PORT = process.env.PORT || 8080;

const app = express();
const fs = require("fs");
const { parse } = require("csv-parse");
var cors = require('cors');
var csv = require('fast-csv')
const mysql = require("mysql2")
const results = []
const db = mysql.createPool({
    host: "localhost",
    user: "deangelly",
    password: "password",
    database: "crudestoque",
});


app.get('/createpoststable',(req,res) =>{
    let sql = "CREATE TABLE table_estoque (id INT NOT NULL AUTO_INCREMENT,date VARCHAR(45) NOT NULL,open VARCHAR(45) NOT NULL, high VARCHAR(45) NOT NULL, low VARCHAR(45) NOT NULL, close VARCHAR(45) NOT NULL,volume VARCHAR(45) NOT NULL, status VARCHAR(45) NOT NULL DEFAULT 'x',PRIMARY KEY (id))";
    db.query(sql,(err,result)=>{
        if(err) throw err
        console.log(result)
        res.send('Post table created')
    })
})

app.get('/createpolitctable',(req,res) =>{
    let sql = 'CREATE TABLE politic_table (id INT NOT NULL AUTO_INCREMENT,otimo VARCHAR(45) NOT NULL,critico VARCHAR(45) NOT NULL,PRIMARY KEY (id))';
    db.query(sql,(err,result)=>{
        if(err) throw err
        console.log(result)
        res.send('Politic table created')
    })
})


app.use(express.json())

const uploadDoc = require('./middlewares/uploadDocumento')


app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers","X-PINGOTHER,Content-Type,Authorization")
  app.use(cors());
  next();
});

app.post("/upload-documento",uploadDoc.single('file'), async(req,res)=>{

    let counter = 0
    if(req.file){ 
    fs.createReadStream(req.file.path)
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", (data)=> results.push(data))
    .on("end", () =>{
      console.log(results);
    });
    

    const sql = "INSERT INTO table_estoque (date,open,high,low,close,volume) VALUES ?";
    db.query(sql,[results],(err,result) =>{
        console.log(err)
    })

  return res.json({
    erro:false,
    mensagem: "Upload realizado com sucesso!"
  });
}

return res.status(400).json({
    
  erro: true,
  mensagem: "Formato de arquivo inválido!"
})
 
});

app.put("/upload-politica", async(req,res)=>{


    console.log(req.body)
    if(req){

        const sql = "UPDATE politic SET otimo = " + req.body.otimo +" , critico =" + req.body.critico + " WHERE idpolitic = 1 ";
         db.query(sql,(err,result) =>{
        console.log(err)
    })
      return res.json({
        erro:false,
        mensagem: "Upload realizado com sucesso!"
      });
    }
    
    
    console.log(req)
    return res.status(400).json({
        
      erro: true,
      mensagem: "Formato de arquivo inválido!"
    })
     
    });

app.get("/getPolitic",(req,res)=>{

    
    let SQL = "SELECT * from politic"

   db.query(SQL,(err,result)=>{
    if(err) console.log(err)
    else 
    
    res.send(result)
   })

})

app.get("/getEstoque",(req,res)=>{

    
    let SQL = "SELECT * from table_estoque"

   db.query(SQL,(err,result)=>{
    if(err) console.log(err)
    else res.send(result)
    
   })

})
app.listen(8080,() =>{
  console.log("Servidor iniciado na porta 8080: http://localhost:8080");
})



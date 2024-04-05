const express = require("express");
const bodyParser = require("body-parser");
const conn = require("./databse")



const app = express();

app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send("INDEX PAGE MAY BE COMING HERE");
})


app.post('/user/signup',(req,res)=>{
    
    // res.send("SIGNUP PAGE MAY BE COMING HERE");
    const {email,password} = req.body;


    const query1 = 'INSERT INTO USER (email,password) values (?,?)';


    conn.query(query1,[email,password],(err,response)=>{

        if(err){
            console.log("Encountered Error: ",err);
            res.status(400).json({message:"Couldnt signup user"});
            return;
        }

        res.status(201).json({status: "Success",
                              message:"User registered",
                              payload:{
                                id:response.insertId,
                              }
                            });

    })


});

app.listen(9090,()=>{
    console.log("Test");
})
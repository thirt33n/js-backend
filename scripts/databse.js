const mysql = require("mysql");

const conn =  mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'tanxfi'
});

conn.connect((err)=>{
    if (err){
        console.log("Error connecting to the SQL Server",err);
        return;
    }
    else{
        console.log("Successguly connected to the mysql server");
    }
})

module.exports = conn
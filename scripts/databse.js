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
        console.log("Successfuly connected to the mysql server");
    }
})

const account_table_creation =`
CREATE TABLE IF NOT EXISTS account (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    currency VARCHAR(255) NOT NULL,
    balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES user(id)
)

`;

conn.query(account_table_creation,(err,result)=>{
    if(err)
    {
        console.log("Error encountered: ",err);
        return;
    }
    console.log("Table Created succesfuly");

});



module.exports = conn
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

const wallet_table_creation =`
CREATE TABLE IF NOT EXISTS wallet (
    wallet_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    btc INT(4),
    eth INT(4),
    doge INT(4),
    FOREIGN KEY (user_id) REFERENCES user(id)
);
`;

const order_table_creation = `
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    side VARCHAR(4) DEFAULT 'none',
    price FLOAT,
    volume FLOAT,
    state VARCHAR(10) DEFAULT 'pending',
    buyCur VARCHAR(4),
    sellCur VARCHAR(4) DEFAULT 'none',
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploadTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
);
`;

conn.query(account_table_creation,(err,result)=>{
    if(err)
    {
        console.log("Error encountered: ",err);
        return;
    }
    console.log("Account Table initialized succesfuly");

});


conn.query(wallet_table_creation,(err,res)=>{
    if(err)
    {
        console.log("Unable to create table wallet: ",err);
        return;
    }
    console.log("Wallet Table initialized succesfuly");
})

conn.query(order_table_creation,(err,res)=>{
    if(err)
    {
        console.log("Unable to create table Orders: ",err);
        return;
    }
    console.log("Orders Table initialized succesfuly");
})


module.exports = conn
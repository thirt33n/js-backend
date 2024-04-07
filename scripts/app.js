const express = require("express");
const bodyParser = require("body-parser");
const conn = require("./databse")



const app = express();

app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send("INDEX PAGE MAY BE COMING HERE");
})

//SIGNUP API
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

        console.log(response);
        res.status(201).json({status: "Success",
                              message:"User registered",
                              payload:{
                                id:response.insertId,
                              }
                            });

    })


});

//DEPOSIT API

app.post('/wallet/deposit',(req,res)=>{

    const {user_id,currency,amount} = req.body;
    const fetch_cur_balance = "SELECT BALANCE FROM ACCOUNT WHERE USER_ID = ?";

    conn.query(fetch_cur_balance,[user_id],(err,result)=>{
        
        if(err){ console.log("Not Found Error: ",err); res.status(500).json({message:"NOT FOUND"}); return;};

        console.log(result);
        if(result.length == 0)
        {
            const new_account_setup = "INSERT INTO ACCOUNT (USER_ID,CURRENCY,BALANCE) VALUES (?,?,?);";

            conn.query(new_account_setup,[user_id,currency,amount],(error,resulter)=>{
                if(err){
                    console.log("Error: ",error); 
                    res.status(500).json({message:"Unable to setup account"});    
                    return;
                };
                console.log("Account setup complete");
                res.status(200).json({status:"Success",message:"Succesfuly setup and deposit funds",payload:{
                    balance:amount,
                    currency:currency
                }});

            })
        }
        else{
            const CurBal = result[0].BALANCE;
            const newBal = amount+CurBal;

            const updater = "UPDATE ACCOUNT SET BALANCE = ? WHERE USER_ID = ?";
            conn.query(updater,[newBal,user_id],(err,results)=>{
                if(err)
                {
                    console.log("Unable to process deposit: ",err);
                    res.status(500).json({message:"Unable to deposit the fund"});
                    return;
                }
                console.log("Succesfuly deposited the fund");
                res.status(200).json({status:"Success",message:"Succesfuly deposited the funds",payload:{
                        balance:newBal,
                        currency:currency
                }})
            })
        }
        

    })
    
})

//WITHDRAW API
app.post('/wallet/withdraw',(req,res)=>{

    const {user_id,currency,amount} = req.body;
    
    const fetch_cur_balance = "SELECT BALANCE FROM ACCOUNT WHERE USER_ID = ?";

    conn.query(fetch_cur_balance,[user_id],(err,result)=>{
        
        if(err){ console.log("Not Found Error: ",err); res.status(500).json({message:"NOT FOUND"}); return;};

        console.log(result);

        if(result.length == 0)
        {
            console.log("NOTHING TO WITHDRAW FROM!",err);
            res.status(500).json({message:"Nothing in the account to withdraw From"});
            return;
        }
        else{
            console.log(result);
            const CurBal = result[0].BALANCE;
            console.log(CurBal);
            if(CurBal == 0.00)
            {
                console.log("NOTHING TO WITHDRAW FROM!",err);
                res.status(500).json({message:"Nothing in the account to withdrawfrom"});
                return;
            }

            else if(amount>CurBal)
            {
                console.log("NOT ENOUGH FUNDS TO WITHDRAW",err);
                res.status(500).json({message:"Not Enough FUNDS TO WITHDRAW"});
                return;
            }
            else{
                const newBal = CurBal-amount;
                // console.log(CurBal);
                // console.log(newBal);
                const updater = "UPDATE ACCOUNT SET BALANCE = ? WHERE USER_ID = ?";
                conn.query(updater,[newBal,user_id],(err,results)=>{
                    if(err)
                    {
                        console.log("Unable to process withdrawal: ",err);
                        res.status(500).json({message:"Unable to withdraw the fund"});
                        return;
                    }
                    console.log("Succesfuly Withdrew the fund");
                    res.status(200).json({status:"Success",message:"Succesfuly withdrew the funds",payload:{
                            balance:newBal,
                            currency:currency
                    }})
                })
            }
    }
        

    })
    // 
})



//FETCH Balance from account andbtc,eth,doge from wallet using a join
// app.get('wallet/balances',(req,res)=>{

// })

//Creating orders:

app.post("/order/create", (req, res) => {
    
    const { user_id, side, price, volume, buyCur, sellCur } = req.body;
    


    const order_insertion = "INSERT INTO ORDERS (user_id,side,price,volume,buyCur,sellCur) VALUES (?,?,?,?,?,?)";

    conn.query(order_insertion,[user_id,side,price,volume,buyCur,sellCur],(err,result)=>{
        if(err)
        {
            console.log("Unable to initiate order");
            res.status(500).json({message:"Error: Order Not placed"});
            return;
        }

        console.log("Order placed Pending waiting for approval");
        
        res.status(200).json({Status:"Success",message:"Successfuly placed order",Payload:{
            id:result.insertId,
            side:side,
            price:price,
            volume:volume,
            state:"Pending",
            buy_currency:buyCur,
            sellCur:sellCur,
        
        }})
    })



});

//Cancelling Orders:
app.put("/order/cancel",(req,res)=>{
    const {order_id} = req.body;

    const delete_query = 'UPDATE ORDERS SET STATE = "Cancelled" where order_id = ? AND State = "pending"' ;
   
    conn.query(delete_query,[order_id],(err,result)=>{
        if(err)
        {
            console.log("Unable to cancel order: ",order_id);
            res.status(500).json({message:"Unable to Cance order ",order_id});
            return;
        }

        if (result.affectedRows === 0) {
            console.log("Order not found or already cancelled:", order_id);
            res.status(404).json({ message: "Order not found or already cancelled", order_id });
            return;
        }

        console.log("Order Succesfuly cancelled");
        res.status(200).json({status:"Success",message:"Succesfuly cancelled",Payload:""});

    })
})


//ADMIN APIS


//Success checking api:

app.post("/admin/check",(req,res)=>{

    const {order_id} = req.body;

    fetch_order_details = "SELECT * FROM ORDERS WHERE ORDER_ID = ?";

    

    conn.query(fetch_order_details,[order_id],(err,result)=>{
        if(err)
        {
            console.log("Unable to retrieve order detials",err);
            res.status(500).json({status:"Fail",message:"Unable to fetch order details"});
            return;
        }
        // console.log(result);
        user_id = result[0].user_id;
    
        side  = result[0].side;
        price = result[0].price;
        vol = result[0].volume;
        buyCur = result[0].buyCur;

        if(side == "buy")
        {
            const check_balance_query = "SELECT BALANCE FROM ACCOUNT WHERE USER_ID = ?";
            conn.query(check_balance_query,[user_id],(err,bal_res)=>{
                if(err)
                {
                    console.log("Error",err);
                    // res.status(500).json({message:"Error"})
                    res.status(500).json({status:"fail",message:"Unable to credit crypto"});

                    return;
                }
                const curBal = bal_res[0].BALANCE;

                if(curBal>price) //Checking if the person has the balance to buy the volume
                {
                        const wallet_update = `INSERT INTO WALLET (user_id,${buyCur}) VALUES (?,?) ON DUPLICATE KEY UPDATE ${buyCur} = ${buyCur}+?`;
                        conn.query(wallet_update,[user_id,vol,vol],(err,wal_up)=>{
                            if(err)
                            {
                                console.log("Unable to update wallet",err);
                                res.status(500).json({status:"fail",message:"Unable to credit crypto"});
                                return;
                            }

                            console.log("Wallet Updated");
                            res.status(200).json({status:"Success",mesage:"Successfuly Added Crypto to wallet",payload:{
                                    User:user_id,
                                    balance:curBal-price,
                            }});
                            
                        })

                    //UPDATING ACCOUNT BALANCE
                    const acc_bal_update = `UPDATE ACCOUNT SET BALANCE = ${curBal} - ? WHERE USER_ID = ?`;
                    conn.query(acc_bal_update,[price,user_id],(err,acc_bal_res)=>{
                        if(err)
                        {
                            console.log("Unable to complete sale",err);
                            return;
                        }
                        console.log("Account Balance updated");
                
                    })

                    //UPDATING THE ORDER
                    const order_status_update = `UPDATE ORDERS SET STATE = "Success" where order_id = ?`;
                    conn.query(order_status_update,[order_id],(err,or_up)=>{
                        if(err){ console.log("Unable to update status: ",err); return;}
                        console.log("Updated order status");
                    })
                }

                if(curBal<price)
                {
                    console.log("Insufficient funds");
                    res.status(403).json({status:"fail",message:"You have insufficient funds for this purchase"});
                    
                    const order_status_update = `UPDATE ORDERS SET STATE = "Cancel" where order_id = ?`;
                    conn.query(order_status_update,[order_id],(err,or_up)=>{
                        if(err){ console.log("Unable to update status: ",err); return;}
                        console.log("Updated order status");
                    })
                    return;
                }
            })
        }

        //Selling

        if(side == "sell")
        {
            const check_balance_query = `SELECT ${buyCur} FROM WALLET WHERE USER_ID = ?`;
            conn.query(check_balance_query,[user_id],(err,bal_res)=>{
                if(err)
                {
                    console.log("Error",err);
                    // res.status(500).json({message:"Error"})
                    res.status(500).json({status:"fail",message:"Unable to credit crypto"});
                    return;
                }
                console.log(bal_res);

                const crypto_left = bal_res[0][buyCur];
                const crypto = [buyCur];

                if(crypto_left>vol) //Checking if the person has the balance to buy the volume
                {
                        const wallet_update = `UPDATE WALLET SET ${buyCur} = ${buyCur} - ? where user_id = ?`;
                        conn.query(wallet_update,[vol,user_id],(err,wal_up)=>{
                            if(err)
                            {
                                console.log("Unable to update wallet",err);
                                res.status(500).json({status:"fail",message:"Unable to credit crypto"});
                                return;
                            }

                            console.log("Wallet Updated");
                            res.status(200).json({status:"Success",mesage:"Successfuly Sold Crypto from wallet",payload:{
                                User: user_id,
                                [crypto]:crypto_left-vol
                            }});
                            
                        })

                        //UPDATING THE ACCOUNT BALANCE
                        const acc_bal_update = `UPDATE ACCOUNT SET BALANCE = BALANCE + ? WHERE USER_ID = ?`;
                        conn.query(acc_bal_update,[price,user_id],(err,acc_bal_res)=>{
                        if(err)
                        {
                            console.log("Unable to complete sale",err);
                            return;
                        }
                        console.log("Account Balance updated");
                
                    })

                    //UPDATING THE ORDER
                    const order_status_update = `UPDATE ORDERS SET STATE = "Declined" where order_id = ?`;
                    conn.query(order_status_update,[order_id],(err,or_up)=>{
                        if(err){ console.log("Unable to update status: ",err); return;}
                        console.log("Updated order status");
                    })

                }

                if(crypto_left<vol)
                {
                    console.log("Insufficient coins");
                    res.status(403).json({status:"fail",message:"You have insufficient coins for this sale"});
                    
                    const order_status_update = `UPDATE ORDERS SET STATE = "Cancel" where order_id = ?`;
                    conn.query(order_status_update,[order_id],(err,or_up)=>{
                        if(err){ console.log("Unable to update status: ",err); return;}
                        console.log("Updated order status");
                    })
                    return;
                }
            })            




        }



    })
    // console.log(user_id);
    

})


app.listen(9090,()=>{
    console.log("Test");
})
Sending request to signup:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"email":"email@gmail.com","password":"Password123#"}' localhost:9090/user/signup
```

Sending Request to Deposit Cash:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"user_id":4,"currency":"USD","amount":120.00}' localhost:9090/wallet/deposit

{"status":"Success","message":"Succesfuly deposited the funds","payload":{"balance":240,"currency":"USD"}}
```

Sending Request to Withdraw Cash:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"user_id":4,"currency":"USD","amount":70.00}' localhost:9090/wallet/withdraw

{"status":"Success","message":"Succesfuly withdrew the funds","payload":{"balance":170,"currency":"USD"}}

curl -X POST -H "Content-Type: application/json" -d '{"user_id":4,"currency":"USD","amount":1000.00}' 192.168.0.103:9090/wallet/withdraw

{"message":"Not Enough FUNDS TO WITHDRAW"}
```

Placing an Order:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"user_id":5,"side":"buy","price":1000.00,"volume":2,"buyCur":"btc","sellCur":"usd"}' 192.168.0.103:9090/order/create
```

Cancelling an Order:
```bash
curl -X PUT -H "Content-Type: application/json" -d '{"order_id":1}' 192.168.0.103:9090/order/cancel
```


Admin API to Approve or decline transactions:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"order_id":10}' localhost:9090/admin/check

{"status":"Success","mesage":"Successfuly Sold Crypto from wallet"}
```


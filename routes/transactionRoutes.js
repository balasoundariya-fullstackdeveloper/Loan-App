const express = require ("express");
const { addTransaction ,getAllTransaction,editTransaction,deleteTransaction} = require("../controllers/transactionController");

//router object
const router = express.Router()


//routers
//add transaction
router.post('/add-transaction',addTransaction);

//get transaction
router.post('/get-transaction',getAllTransaction)

//edit transaction
router.post('/edit-transaction',editTransaction);

//delete transaction
router.post('/delete-transaction',deleteTransaction);



module.exports=router
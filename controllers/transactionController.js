const transactionModel = require("../models/transactionModel");
const moment = require("moment");

const getAllTransaction = async (req, res) => {
  try {
    const { frequency, selectedDate, userid } = req.body;

    // Ensure selectedDate is defined when frequency is "custom"
    if (
      frequency === "custom" &&
      (!selectedDate || selectedDate.length !== 2)
    ) {
      return res
        .status(400)
        .json({ error: "selectedDate must be an array with two dates" });
    }

    const transactions = await transactionModel.find({
      ...(frequency !== "custom"
        ? {
            date: {
              $gt: moment().subtract(Number(frequency), "d").toDate(),
            },
          }
        : {
            date: {
              $gte: new Date(selectedDate[0]),
              $lte: new Date(selectedDate[1]),
            },
          }),
      userid: userid,
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const addTransaction = async (req, res) => {
  try {
    const newTransaction = new transactionModel(req.body);
    await newTransaction.save();
    res.status(201).send("Transaction Created");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const editTransaction = async (req, res) => {
  try {
    await transactionModel.findOneAndUpdate(
      { _id: req.body.transactionId },
      req.body.payload
    );
    res.status(200).send("Edited Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deleteTransaction = async (req, res) => {
  try {
    await transactionModel.findOneAndDelete({_id:req.body.transactionId})
    res.status(200).send("Loan Details Deleted Successfully")
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  getAllTransaction,
  addTransaction,
  editTransaction,
  deleteTransaction,
};

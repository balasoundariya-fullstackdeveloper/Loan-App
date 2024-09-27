const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: "true",
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
    },
    date: {
      type: Date,
      required: [true, "date is required"],
    },
    reference: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    place: {
      type: String,
      required: [true, "place is required"],
    },
    images:[
      {
        image:{
          type:String,
        }
      }
    ] 
  
  },
  { timestamps: true }
);
const transactionModel = mongoose.model("transactions", transactionSchema);
module.exports = transactionModel;

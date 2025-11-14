const mongoose = require('mongoose');
const ExpenseSchema = new mongoose.Schema({
  amount: Number,
  category: String,
  date: Date,
  note: String
});
module.exports = mongoose.model('Expense', ExpenseSchema);

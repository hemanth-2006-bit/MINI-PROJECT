const express = require('express');
const mongoose = require('mongoose');
const Expense = require('./models/Expense');


const path = require('path');
const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/expense_tracker');
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// POST a new expense
app.post('/api/expenses', async (req, res) => {
  const { amount, category, date, note } = req.body;
  const expense = new Expense({ amount, category, date, note });
  await expense.save();
  res.json(expense);
});

// GET all expenses
app.get('/api/expenses', async (_req, res) => {
  const expenses = await Expense.find().sort({ date: -1 });
  res.json(expenses);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

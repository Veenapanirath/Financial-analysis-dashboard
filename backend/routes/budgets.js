const express = require('express');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// ============================================
// GET ALL BUDGETS - GET /api/budgets
// ============================================
router.get('/', auth, async (req, res) => {
  try {
    const { month } = req.query;

    const now = new Date();
    const currentMonth = month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const budgets = await Budget.find({
      userId: req.user.id,
      month: currentMonth,
    }).sort({ category: 1 });

    // Enrich with spending data
    const [year, monthNum] = currentMonth.split('-');
    const startDate = new Date(`${year}-${monthNum}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);

    const transactions = await Transaction.find({
      userId: req.user.id,
      date: { $gte: startDate, $lt: endDate },
    });

    const spending = {};
    transactions.forEach(t => {
      spending[t.category] = (spending[t.category] || 0) + t.amount;
    });

    const enrichedBudgets = budgets.map(b => ({
      ...b.toObject(),
      spent: spending[b.category] || 0,
      percentSpent: Math.round(((spending[b.category] || 0) / b.limit) * 100),
      remaining: b.limit - (spending[b.category] || 0),
    }));

    res.json(enrichedBudgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// CREATE BUDGET - POST /api/budgets
// ============================================
router.post('/', auth, async (req, res) => {
  try {
    const { category, limit, month, alert } = req.body;

    // Validation
    if (!category || !limit) {
      return res.status(400).json({ error: 'Category and limit are required' });
    }

    const now = new Date();
    const budgetMonth = month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Check if budget already exists
    let budget = await Budget.findOne({
      userId: req.user.id,
      category,
      month: budgetMonth,
    });

    if (budget) {
      return res.status(400).json({ error: 'Budget for this category already exists' });
    }

    budget = new Budget({
      userId: req.user.id,
      category,
      limit,
      month: budgetMonth,
      alert: alert || 80,
    });

    await budget.save();

    res.status(201).json({
      message: 'Budget created successfully',
      data: budget,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================
// UPDATE BUDGET - PUT /api/budgets/:id
// ============================================
router.put('/:id', auth, async (req, res) => {
  try {
    const { limit, alert, isActive } = req.body;

    let budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    // Check authorization
    if (budget.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (limit !== undefined) budget.limit = limit;
    if (alert !== undefined) budget.alert = alert;
    if (isActive !== undefined) budget.isActive = isActive;

    await budget.save();

    res.json({
      message: 'Budget updated successfully',
      data: budget,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================
// DELETE BUDGET - DELETE /api/budgets/:id
// ============================================
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    // Check authorization
    if (budget.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Budget.findByIdAndDelete(req.params.id);

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

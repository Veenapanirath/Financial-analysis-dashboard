const express = require('express');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

const router = express.Router();

// ============================================
// GET DASHBOARD SUMMARY - GET /api/analytics/summary
// ============================================
router.get('/summary', auth, async (req, res) => {
  try {
    const { month } = req.query;
    
    // Get current month if not specified
    const now = new Date();
    const currentMonth = month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const [year, monthNum] = currentMonth.split('-');
    
    const startDate = new Date(`${year}-${monthNum}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);

    // Total spent this month
    const transactions = await Transaction.find({
      userId: req.user.id,
      date: { $gte: startDate, $lt: endDate },
    });

    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown
    const categoryBreakdown = {};
    transactions.forEach(t => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
    });

    // Budget comparison
    const budget = await Budget.findOne({
      userId: req.user.id,
      month: currentMonth,
      category: 'Overall',
    });

    const monthlyBudget = budget?.limit || 5000;
    const remaining = monthlyBudget - totalSpent;
    const percentSpent = Math.round((totalSpent / monthlyBudget) * 100);

    res.json({
      month: currentMonth,
      totalSpent,
      monthlyBudget,
      remaining,
      percentSpent,
      categoryBreakdown,
      transactionCount: transactions.length,
      budgetStatus: percentSpent > 100 ? 'Over Budget' : percentSpent > 80 ? 'Warning' : 'On Track',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GET EXPENSE BREAKDOWN - GET /api/analytics/breakdown
// ============================================
router.get('/breakdown', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = { userId: req.user.id };
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const transactions = await Transaction.find(filter);

    const breakdown = {};
    transactions.forEach(t => {
      if (!breakdown[t.category]) {
        breakdown[t.category] = { amount: 0, count: 0 };
      }
      breakdown[t.category].amount += t.amount;
      breakdown[t.category].count += 1;
    });

    const total = Object.values(breakdown).reduce((sum, cat) => sum + cat.amount, 0);

    const result = Object.entries(breakdown).map(([category, data]) => ({
      category,
      amount: data.amount,
      percentage: total > 0 ? Math.round((data.amount / total) * 100) : 0,
      count: data.count,
    }));

    res.json({
      total,
      categories: result.sort((a, b) => b.amount - a.amount),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GET MONTHLY TRENDS - GET /api/analytics/trends
// ============================================
router.get('/trends', auth, async (req, res) => {
  try {
    const { months = 6 } = req.query;

    const trends = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1);
      
      const monthStr = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;

      const monthTransactions = await Transaction.find({
        userId: req.user.id,
        date: { $gte: monthDate, $lt: nextMonth },
      });

      const total = monthTransactions.reduce((sum, t) => sum + t.amount, 0);

      trends.push({
        month: monthStr,
        total,
        count: monthTransactions.length,
      });
    }

    res.json({ trends });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GET BUDGET VS ACTUAL - GET /api/analytics/budget-vs-actual
// ============================================
router.get('/budget-vs-actual', auth, async (req, res) => {
  try {
    const { month } = req.query;

    const now = new Date();
    const currentMonth = month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const [year, monthNum] = currentMonth.split('-');
    
    const startDate = new Date(`${year}-${monthNum}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);

    // Get all budgets for the month
    const budgets = await Budget.find({
      userId: req.user.id,
      month: currentMonth,
    });

    // Get transactions for the month
    const transactions = await Transaction.find({
      userId: req.user.id,
      date: { $gte: startDate, $lt: endDate },
    });

    // Calculate actual spending by category
    const actualSpending = {};
    transactions.forEach(t => {
      actualSpending[t.category] = (actualSpending[t.category] || 0) + t.amount;
    });

    // Compare budgets with actual
    const comparison = budgets
      .filter(b => b.category !== 'Overall')
      .map(budget => ({
        category: budget.category,
        budgeted: budget.limit,
        actual: actualSpending[budget.category] || 0,
        remaining: budget.limit - (actualSpending[budget.category] || 0),
        variance: ((actualSpending[budget.category] || 0) - budget.limit),
        variancePercent: Math.round((((actualSpending[budget.category] || 0) - budget.limit) / budget.limit) * 100),
        status: (actualSpending[budget.category] || 0) > budget.limit ? 'Over' : 'Under',
      }));

    const totalBudgeted = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalActual = Object.values(actualSpending).reduce((sum, a) => sum + a, 0);

    res.json({
      month: currentMonth,
      totalBudgeted,
      totalActual,
      totalVariance: totalBudgeted - totalActual,
      comparisons: comparison,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GET KEY METRICS - GET /api/analytics/metrics
// ============================================
router.get('/metrics', auth, async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // This month's data
    const [year, monthNum] = currentMonth.split('-');
    const startDate = new Date(`${year}-${monthNum}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);

    const thisMonthTransactions = await Transaction.find({
      userId: req.user.id,
      date: { $gte: startDate, $lt: endDate },
    });

    // Last month's data
    const lastMonthStart = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1);
    const lastMonthEnd = startDate;

    const lastMonthTransactions = await Transaction.find({
      userId: req.user.id,
      date: { $gte: lastMonthStart, $lt: lastMonthEnd },
    });

    const thisMonthTotal = thisMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
    const lastMonthTotal = lastMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
    const avgTransaction = thisMonthTransactions.length > 0 ? thisMonthTotal / thisMonthTransactions.length : 0;
    const monthOverMonthChange = lastMonthTotal > 0 ? Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100) : 0;

    res.json({
      thisMonthTotal,
      lastMonthTotal,
      monthOverMonthChange,
      avgTransaction: Math.round(avgTransaction * 100) / 100,
      transactionCount: thisMonthTransactions.length,
      topCategory: Object.entries(
        thisMonthTransactions.reduce((acc, t) => ({
          ...acc,
          [t.category]: (acc[t.category] || 0) + t.amount,
        }), {})
      ).sort((a, b) => b[1] - a[1])[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

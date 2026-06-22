const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// ============================================
// GET ALL TRANSACTIONS - GET /api/transactions
// ============================================
router.get('/', auth, async (req, res) => {
  try {
    const { category, startDate, endDate, limit = 50, page = 1 } = req.query;

    // Build filter
    const filter = { userId: req.user.id };
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Get total count
    const total = await Transaction.countDocuments(filter);

    // Get paginated transactions
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json({
      data: transactions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GET SINGLE TRANSACTION - GET /api/transactions/:id
// ============================================
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Check authorization
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// CREATE TRANSACTION - POST /api/transactions
// ============================================
router.post('/', auth, async (req, res) => {
  try {
    const { category, amount, description, date, paymentMethod, tags, notes } = req.body;

    // Validation
    if (!category || !amount) {
      return res.status(400).json({ error: 'Category and amount are required' });
    }

    const newTransaction = new Transaction({
      userId: req.user.id,
      category,
      amount,
      description: description || '',
      date: date || new Date(),
      paymentMethod: paymentMethod || 'Cash',
      tags: tags || [],
      notes: notes || '',
    });

    await newTransaction.save();

    res.status(201).json({
      message: 'Transaction created successfully',
      data: newTransaction,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================
// UPDATE TRANSACTION - PUT /api/transactions/:id
// ============================================
router.put('/:id', auth, async (req, res) => {
  try {
    const { category, amount, description, date, paymentMethod, tags, status, notes } = req.body;

    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Check authorization
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Update fields
    if (category) transaction.category = category;
    if (amount !== undefined) transaction.amount = amount;
    if (description) transaction.description = description;
    if (date) transaction.date = date;
    if (paymentMethod) transaction.paymentMethod = paymentMethod;
    if (tags) transaction.tags = tags;
    if (status) transaction.status = status;
    if (notes) transaction.notes = notes;

    await transaction.save();

    res.json({
      message: 'Transaction updated successfully',
      data: transaction,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================
// DELETE TRANSACTION - DELETE /api/transactions/:id
// ============================================
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Check authorization
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// BULK DELETE - DELETE /api/transactions
// ============================================
router.delete('/', auth, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'IDs array is required' });
    }

    const result = await Transaction.deleteMany({
      _id: { $in: ids },
      userId: req.user.id,
    });

    res.json({
      message: 'Transactions deleted',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

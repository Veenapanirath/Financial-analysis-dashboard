const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    category: {
      type: String,
      enum: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other', 'Overall'],
      required: [true, 'Category is required'],
    },
    limit: {
      type: Number,
      required: [true, 'Budget limit is required'],
      min: [0, 'Budget cannot be negative'],
    },
    spent: {
      type: Number,
      default: 0,
      min: 0,
    },
    month: {
      type: String, // Format: "2024-01" (YYYY-MM)
      required: true,
    },
    alert: {
      type: Number,
      default: 80, // Alert when 80% of budget is spent
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
BudgetSchema.index({ userId: 1, month: 1 });
BudgetSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Budget', BudgetSchema);

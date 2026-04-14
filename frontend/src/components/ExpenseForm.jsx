import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addExpense } from '../store/expenseSlice';
import { PlusCircle, Image, CheckCircle2, Loader2 } from 'lucide-react';

const INITIAL_FORM = {
  title: '',
  amount: '',
  category: 'Housing',
  date: new Date().toISOString().split('T')[0],
  type: 'EXPENSE',
  receipt: null,
};

const ExpenseForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    'Housing', 'Food', 'Transportation', 'Utilities',
    'Insurance', 'Medical', 'Savings', 'Personal', 'Entertainment'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;
    setLoading(true);
    setError(null);

    const result = await dispatch(addExpense({
      ...formData,
      amount: parseFloat(formData.amount),
    }));

    setLoading(false);

    if (addExpense.fulfilled.match(result)) {
      setSuccess(true);
      setFormData(INITIAL_FORM);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.payload || 'Failed to add transaction. Is the backend running?');
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2.5rem' }}>
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
        <PlusCircle size={24} color="var(--accent)" />
        New Entry
      </h2>

      {success && (
        <div style={{
          backgroundColor: 'rgba(5, 150, 105, 0.1)',
          color: 'var(--success)',
          padding: '0.875rem 1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={16} /> Transaction recorded successfully!
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          color: 'var(--danger)',
          padding: '0.875rem 1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          textAlign: 'center'
        }}>
          {typeof error === 'string' ? error : JSON.stringify(error)}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Workspace Subscription"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            style={{ fontWeight: 600 }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="form-control"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              style={{ fontWeight: 800, fontSize: '1.1rem' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{ fontWeight: 600 }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label className="form-label">Type</label>
          <select
            className="form-control"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            style={{ fontWeight: 600 }}
          >
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </div>

        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label className="form-label">Transaction Date</label>
          <input
            type="date"
            className="form-control"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            style={{ fontWeight: 600 }}
          />
        </div>

        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label className="form-label">Proof of Purchase</label>
          <div style={{ position: 'relative' }}>
            <input
              type="file"
              className="form-control"
              style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer', zIndex: 2 }}
              onChange={(e) => {
                if (e.target.files[0]) {
                  setFormData({ ...formData, receipt: e.target.files[0].name });
                }
              }}
            />
            <div className="form-control" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              pointerEvents: 'none',
              background: formData.receipt ? 'rgba(5, 150, 105, 0.05)' : 'var(--input-bg)',
              borderColor: formData.receipt ? 'var(--success)' : 'var(--card-border)'
            }}>
              {formData.receipt ? <CheckCircle2 size={18} color="var(--success)" /> : <Image size={18} color="var(--accent)" />}
              <span style={{ color: formData.receipt ? 'var(--success)' : 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                {formData.receipt ? `Attached: ${formData.receipt}` : 'Upload receipt or invoice...'}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '2.5rem', padding: '1rem', fontWeight: 700, fontSize: '1.1rem' }}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Record Transaction'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;

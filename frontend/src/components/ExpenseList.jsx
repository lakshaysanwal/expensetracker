import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteExpense, updateExpense } from '../store/expenseSlice';
import { Trash2, Edit3, Check, X, TrendingDown, Clock, Image, FileText, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

// Spring Boot LocalDate returns as [year, month, day] array OR as 'YYYY-MM-DD' string
const parseDate = (d) => {
  if (!d) return new Date();
  if (Array.isArray(d)) return new Date(d[0], d[1] - 1, d[2]);
  return new Date(d);
};

const ExpenseList = () => {
  const { items, status, filters } = useSelector((state) => state.expenses);
  const dispatch = useDispatch();
  
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const categories = [
    'Housing', 'Food', 'Transportation', 'Utilities', 
    'Insurance', 'Medical', 'Savings', 'Personal', 'Entertainment'
  ];

  const getCategoryColor = (cat) => {
    const colors = {
      'Housing': '#0F172A',
      'Food': '#F59E0B',
      'Transportation': '#2563EB',
      'Utilities': '#059669',
      'Insurance': '#475569',
      'Medical': '#DC2626',
      'Savings': '#0D9488',
      'Personal': '#6366F1',
      'Entertainment': '#D97706'
    };
    return colors[cat] || 'var(--primary)';
  };

  if (status === 'loading') {
    return (
      <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
        <Loader2 className="animate-spin" size={40} style={{ color: 'var(--accent)', margin: '0 auto' }} />
        <p style={{ marginTop: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Syncing your vault...</p>
      </div>
    );
  }

  const handleEditClick = (expense) => {
    setEditingId(expense.id);
    setEditFormData({ ...expense });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleSave = () => {
    dispatch(updateExpense(editFormData));
    setEditingId(null);
  };

  if (items.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <TrendingDown size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.2, color: 'var(--primary)' }} />
        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Your ledger is empty</h3>
        <p style={{ fontSize: '1rem' }}>Securely record your first transaction to begin tracking.</p>
      </div>
    );
  }

  const filteredItems = items.filter(item => {
    if (filters?.category && filters.category !== 'All' && item.category !== filters.category) return false;
    if (filters?.search && !item.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (filters?.sortBy === 'date-asc') return parseDate(a.date) - parseDate(b.date);
    if (filters?.sortBy === 'amount-desc') return parseFloat(b.amount) - parseFloat(a.amount);
    if (filters?.sortBy === 'amount-asc') return parseFloat(a.amount) - parseFloat(b.amount);
    return parseDate(b.date) - parseDate(a.date);
  });

  return (
    <div className="glass-panel" style={{ padding: '2.5rem' }}>
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem' }}>
        <Clock size={28} color="var(--accent)" />
        Transaction History
      </h2>
      
      <div className="expense-list" style={{ gap: '1rem' }}>
        {sortedItems.map((expense) => (
          <div key={expense.id} className="expense-item" style={{ 
            padding: '1.5rem',
            flexDirection: editingId === expense.id ? 'column' : 'row', 
            alignItems: editingId === expense.id ? 'stretch' : 'center', 
            gap: editingId === expense.id ? '1.5rem' : 'auto',
            border: '1px solid var(--card-border)',
            background: 'var(--background)'
          }}>
            {editingId === expense.id ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ flex: 2, minWidth: '150px' }}
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                />
                <input 
                  type="number" 
                  className="form-control" 
                  style={{ flex: 1, minWidth: '100px' }}
                  value={editFormData.amount}
                  onChange={(e) => setEditFormData({...editFormData, amount: e.target.value})}
                />
                <select 
                  className="form-control" 
                  style={{ flex: 1, minWidth: '140px' }}
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input 
                  type="date" 
                  className="form-control" 
                  style={{ flex: 1, minWidth: '140px' }}
                  value={editFormData.date}
                  onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                />
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-primary" style={{ padding: '0.6rem', width: '40px', height: '40px' }} onClick={handleSave}>
                    <Check size={20} />
                  </button>
                  <button className="btn btn-danger" style={{ padding: '0.6rem', width: '40px', height: '40px' }} onClick={handleCancel}>
                    <X size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="expense-info" style={{ gap: '0.5rem' }}>
                  <div className="expense-title" style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 700 }}>{expense.title}</div>
                  <div className="expense-meta" style={{ gap: '1rem' }}>
                    <span 
                      className="badge" 
                      style={{ 
                        background: `${getCategoryColor(expense.category)}12`,
                        color: getCategoryColor(expense.category),
                        borderColor: `${getCategoryColor(expense.category)}33`,
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {expense.category}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                      {format(parseDate(expense.date), 'MMMM dd, yyyy')}
                    </span>
                    {expense.receipt && (
                      <span title={`Attachment: ${expense.receipt}`} style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center' }}>
                        <Image size={14} />
                      </span>
                    )}
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div className="expense-amount" style={{ 
                    color: 'var(--text-primary)', 
                    fontWeight: 900,
                    fontSize: '1.5rem',
                    letterSpacing: '-0.02em'
                  }}>
                    -₹{parseFloat(expense.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn-icon" 
                      style={{ width: '36px', height: '36px' }}
                      onClick={() => handleEditClick(expense)}
                      title="Edit Entry"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      className="btn-icon" 
                      style={{ width: '36px', height: '36px', color: 'var(--danger)' }}
                      onClick={() => dispatch(deleteExpense(expense.id))}
                      title="Delete Entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AlertCircle, Target, Edit2, Check } from 'lucide-react';

// Spring Boot LocalDate comes as [year, month, day] array or 'YYYY-MM-DD' string
const parseDate = (d) => {
  if (!d) return new Date();
  if (Array.isArray(d)) return new Date(d[0], d[1] - 1, d[2]);
  return new Date(d);
};

const BudgetAlerts = () => {
  const { items } = useSelector(state => state.expenses);
  const [budgetLimit, setBudgetLimit] = useState(15000); // Default budget in ₹
  const [isEditing, setIsEditing] = useState(false);

  const thisMonthExpenses = items.filter(item => {
    const d = parseDate(item.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((sum, item) => sum + parseFloat(item.amount), 0);

  const percentage = budgetLimit > 0 ? (thisMonthExpenses / budgetLimit) * 100 : 0;
  
  let statusColor = 'var(--accent)'; // Default to professional blue
  if (percentage >= 80 && percentage < 100) statusColor = '#F59E0B'; // Amber for warning
  if (percentage >= 100) statusColor = 'var(--danger)';

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
        <Target size={24} color="var(--accent)" />
        Monthly Budget
      </h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Spending</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹{thisMonthExpenses.toLocaleString()}</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Limit</span>
          {isEditing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="number" 
                value={budgetLimit} 
                onChange={(e) => setBudgetLimit(Number(e.target.value))}
                className="form-control"
                style={{ padding: '0.4rem 0.75rem', width: '100px', fontSize: '0.95rem', fontWeight: 600 }}
                autoFocus
              />
              <button 
                onClick={() => setIsEditing(false)} 
                className="btn-icon"
                style={{ width: '32px', height: '32px', color: 'var(--success)' }}
              >
                <Check size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>₹{budgetLimit.toLocaleString()}</span>
              <button 
                onClick={() => setIsEditing(true)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                title="Edit Budget Limit"
              >
                <Edit2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div style={{ 
        width: '100%', 
        height: '8px', 
        background: 'var(--card-border)', 
        borderRadius: '4px', 
        overflow: 'hidden',
        marginBottom: '1.5rem'
      }}>
        <div style={{ 
          height: '100%', 
          width: `${Math.min(percentage, 100)}%`, 
          background: statusColor,
          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `0 0 10px ${statusColor}44`
        }} />
      </div>

      {percentage >= 80 && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          color: percentage >= 100 ? 'var(--danger)' : '#B45309',
          background: percentage >= 100 ? 'var(--danger-glow)' : 'rgba(245, 158, 11, 0.1)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${percentage >= 100 ? 'var(--danger-glow)' : 'rgba(245, 158, 11, 0.2)'}`
        }}>
          <AlertCircle size={20} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            {percentage >= 100 
              ? 'Warning: Budget limit exceeded for this month.' 
              : `Caution: You've used ${Math.round(percentage)}% of your monthly budget.`}
          </span>
        </div>
      )}
    </div>
  );
};

export default BudgetAlerts;

import React from 'react';
import { useSelector } from 'react-redux';
import { Repeat } from 'lucide-react';

const Subscriptions = () => {
  const { items } = useSelector(state => state.expenses);

  // Mapped categories for overhead tracking
  const fixedCategories = ['Housing', 'Insurance', 'Utilities'];
  
  const subscriptions = items.filter(item => fixedCategories.includes(item.category));
  
  const uniqueSubsMap = new Map();
  subscriptions.forEach(sub => {
    if (!uniqueSubsMap.has(sub.title) || new Date(sub.date) > new Date(uniqueSubsMap.get(sub.title).date)) {
      uniqueSubsMap.set(sub.title, sub);
    }
  });

  const uniqueSubs = Array.from(uniqueSubsMap.values());
  const monthlyOverhead = uniqueSubs.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  if (uniqueSubs.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: '2.5rem' }}>
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
        <Repeat size={24} color="var(--accent)" />
        Monthly Fixed Overhead
      </h2>

      <div style={{ marginBottom: '2rem', borderBottom: '1.5px solid var(--card-border)', paddingBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Estimated total</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            ₹{monthlyOverhead.toLocaleString()}
          </span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '1rem' }}>/ month</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {uniqueSubs.map(sub => (
          <div key={sub.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1.25rem',
            background: 'var(--background)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--card-border)',
            borderLeft: '4px solid var(--accent)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{sub.title}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>{sub.category}</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>₹{parseFloat(sub.amount).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;

import React from 'react';
import { useSelector } from 'react-redux';
import { Sparkles } from 'lucide-react';

const AiInsights = () => {
  const { items } = useSelector(state => state.expenses);

  // Generate basic mock "insights" based on current data
  const generateInsights = () => {
    if (items.length === 0) return ["Add some expenses to get AI-powered insights on your spending habits."];
    
    let insights = [];
    
    // Group by category to find top spend
    const categoryTotals = items.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
      return acc;
    }, {});
    
    const topCategory = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b);
    
    insights.push(`Your highest spending category is ${topCategory} at ₹${categoryTotals[topCategory].toFixed(2)}. Consider setting a strict budget here.`);
    
    if (items.length > 5) {
      insights.push(`You have made ${items.length} transactions recently. Try to consolidate smaller purchases to track them easier.`);
    }
    
    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="glass-panel" style={{ 
      padding: '1.5rem', 
      marginBottom: '2rem',
      background: 'linear-gradient(145deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
      border: '1px solid rgba(99, 102, 241, 0.2)'
    }}>
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
        <Sparkles size={18} />
        AI Spending Insights
      </h3>
      
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {insights.map((insight, idx) => (
          <li key={idx} style={{ 
            fontSize: '0.9rem', 
            color: 'var(--text-primary)',
            padding: '0.75rem',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '3px solid var(--primary)'
          }}>
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AiInsights;

import React from 'react';
import { useSelector } from 'react-redux';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { PieChart as PieChartIcon, BarChart2 } from 'lucide-react';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

// Spring Boot LocalDate comes as [year, month, day] array or 'YYYY-MM-DD' string
const parseDate = (d) => {
  if (!d) return new Date();
  if (Array.isArray(d)) return new Date(d[0], d[1] - 1, d[2]);
  return new Date(d);
};

const ExpenseChart = () => {
  const { items } = useSelector((state) => state.expenses);

  if (items.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PieChartIcon color="var(--primary)" />
          Spending by Category
        </h2>
        <div style={{ height: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '1rem' }}>
          <BarChart2 size={56} style={{ opacity: 0.2 }} />
          <p style={{ fontSize: '1rem', fontWeight: 600 }}>Add transactions to see your spending chart</p>
        </div>
      </div>
    );
  }

  // Aggregate by category
  const categoryDataMap = items.reduce((acc, current) => {
    const amount = parseFloat(current.amount);
    if (!acc[current.category]) acc[current.category] = 0;
    acc[current.category] += amount;
    return acc;
  }, {});

  const pieData = Object.keys(categoryDataMap).map((key) => ({
    name: key,
    value: categoryDataMap[key],
  })).sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          background: 'var(--card-bg)', 
          border: '1px solid var(--card-border)',
          padding: '1rem',
          borderRadius: 'var(--radius-sm)',
          backdropFilter: 'blur(8px)',
          color: 'var(--text-primary)'
        }}>
          <p style={{ fontWeight: 600, margin: 0 }}>{payload[0].name}</p>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            ₹{payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <PieChartIcon color="var(--primary)" />
        Spending by Category
      </h2>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={false} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
        {pieData.map((entry, index) => (
          <div key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: COLORS[index % COLORS.length] }}></div>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseChart;

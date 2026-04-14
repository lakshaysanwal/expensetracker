import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses } from '../store/expenseSlice';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import ExpenseChart from './ExpenseChart';
import FilterBar from './FilterBar';
import BudgetAlerts from './BudgetAlerts';
import ExportControls from './ExportControls';
import AiInsights from './AiInsights';
import Subscriptions from './Subscriptions';
import { logout } from '../store/authSlice';
import { Wallet, TrendingUp, CreditCard, Moon, Sun, LogOut, User } from 'lucide-react';

// Spring Boot LocalDate comes as [year, month, day] array or 'YYYY-MM-DD' string
const parseDate = (d) => {
  if (!d) return new Date();
  if (Array.isArray(d)) return new Date(d[0], d[1] - 1, d[2]);
  return new Date(d);
};

const Dashboard = ({ theme, toggleTheme }) => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.expenses);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchExpenses());
    }
  }, [status, dispatch]);

  const totalExpenses = items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const thisMonthExpenses = items.filter(item => {
    const d = parseDate(item.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((sum, item) => sum + parseFloat(item.amount), 0);

  return (
    <div className="app-container">
      <header className="header" style={{ 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '2rem',
        marginBottom: '5rem',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <h1 style={{ fontSize: '3.5rem', margin: 0 }}>Digital Expense Tracker</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 500 }}>Professional Wealth & Expense Management</p>
        </div>

        <div className="header-controls animate-fade-in">
          <div className="user-hub" title="View Profile">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {user?.username}
            </span>
          </div>
          
          <div className="control-divider"></div>
          
          <ExportControls />
          
          <div className="control-divider"></div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={toggleTheme} 
              className="btn-icon-v2" 
              title={theme === 'light' ? "Enter Dark Mode" : "Return to Light Mode"}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button 
              onClick={() => dispatch(logout())} 
              className="btn-icon-v2 logout" 
              title="End Session"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="summary-cards">
        <div className="stat-card glass-panel">
          <div className="stat-title">Total Balance Spent</div>
          <div className="stat-value" style={{ color: 'var(--text-primary)' }}>
            ₹{totalExpenses.toFixed(2)}
          </div>
          <Wallet className="stat-icon" />
        </div>
        
        <div className="stat-card glass-panel">
          <div className="stat-title">This Month</div>
          <div className="stat-value amount-negative">
            -₹{thisMonthExpenses.toFixed(2)}
          </div>
          <TrendingUp className="stat-icon" />
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-title">Transactions</div>
          <div className="stat-value" style={{ color: 'var(--primary)' }}>
            {items.length}
          </div>
          <CreditCard className="stat-icon" />
        </div>
      </div>

      <div className="main-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <ExpenseChart />
          <Subscriptions />
          <FilterBar />
          <ExpenseList />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <BudgetAlerts />
          <ExpenseForm />
          <AiInsights />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

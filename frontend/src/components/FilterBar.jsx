import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../store/expenseSlice';

const FilterBar = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.expenses);

  const categories = [
    'All', 'Housing', 'Food', 'Transportation', 'Utilities', 
    'Insurance', 'Medical', 'Savings', 'Personal', 'Entertainment'
  ];

  const handleSearch = (e) => {
    dispatch(setFilters({ ...filters, search: e.target.value }));
  };

  const handleCategory = (e) => {
    dispatch(setFilters({ ...filters, category: e.target.value }));
  };

  const handleSort = (e) => {
    dispatch(setFilters({ ...filters, sortBy: e.target.value }));
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <div className="form-group" style={{ flex: '1', minWidth: '200px', marginBottom: 0 }}>
        <label className="form-label">Search Transactions</label>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by title..."
            value={filters.search}
            onChange={handleSearch}
            style={{ paddingLeft: '2.5rem', width: '100%' }}
          />
        </div>
      </div>

      <div className="form-group" style={{ minWidth: '150px', marginBottom: 0 }}>
        <label className="form-label">Category</label>
        <select className="form-control" value={filters.category} onChange={handleCategory}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="form-group" style={{ minWidth: '150px', marginBottom: 0 }}>
        <label className="form-label">Sort By</label>
        <select className="form-control" value={filters.sortBy} onChange={handleSort}>
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;

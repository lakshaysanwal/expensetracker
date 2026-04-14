import React from 'react';
import { useSelector } from 'react-redux';
import { Download } from 'lucide-react';

const ExportControls = () => {
  const { items } = useSelector(state => state.expenses);

  const handleExportCSV = () => {
    if (items.length === 0) return;

    // Create CSV header
    const headers = ['ID', 'Title', 'Amount (INR)', 'Category', 'Date'];
    
    // Create CSV rows
    const rows = items.map(item => [
      item.id,
      `"${item.title}"`,
      item.amount,
      item.category,
      item.date
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'expenses.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={handleExportCSV} 
      className="btn" 
      style={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        color: 'var(--text-primary)',
        border: '1px solid var(--card-border)'
      }}
      title="Export to CSV"
    >
      <Download size={18} />
      Export CSV
    </button>
  );
};

export default ExportControls;

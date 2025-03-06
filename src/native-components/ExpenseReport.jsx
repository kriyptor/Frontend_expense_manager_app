import React, { useState } from 'react';
import '../styles/ExpenseReport.css';

const ExpenseReport = ({ expenses }) => {
  const [filterType, setFilterType] = useState('date'); // 'date', 'month', 'year'
  const [filterValue, setFilterValue] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const generateReport = () => {
    let filtered = [];
    
    switch(filterType) {
      case 'date':
        filtered = expenses.filter(expense => 
          expense.date === filterValue
        );
        break;
      
      case 'month':
        filtered = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          const expenseMonth = expenseDate.toLocaleString('default', { month: 'long' });
          return expenseMonth.toLowerCase() === filterValue.toLowerCase();
        });
        break;
      
      case 'year':
        filtered = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getFullYear().toString() === filterValue;
        });
        break;
      
      default:
        filtered = [];
    }

    setFilteredExpenses(filtered);
    const total = filtered.reduce((sum, expense) => sum + Number(expense.amount), 0);
    setTotalAmount(total);
  };

  return (
    <div className="report-container">
      <h2>Expense Report</h2>
      
      <div className="filter-section">
        <div className="filter-type">
          <label>Filter By:</label>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="date">Date</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>

        <div className="filter-value">
          {filterType === 'date' && (
            <input
              type="date"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          )}
          
          {filterType === 'month' && (
            <select 
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            >
              {[
                'January', 'February', 'March', 'April',
                'May', 'June', 'July', 'August',
                'September', 'October', 'November', 'December'
              ].map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          )}
          
          {filterType === 'year' && (
            <input
              type="number"
              min="2000"
              max="2100"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder="Enter year..."
            />
          )}
        </div>

        <button onClick={generateReport} className="generate-btn">
          Generate Report
        </button>
      </div>

      {filteredExpenses.length > 0 ? (
        <div className="report-results">
          <div className="table-container">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map(expense => (
                  <tr key={expense.id}>
                    <td>₹{expense.amount}</td>
                    <td>{expense.category}</td>
                    <td>{expense.description}</td>
                    <td>{expense.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="total-section">
            <h3>Total Expense: ₹{totalAmount}</h3>
          </div>
        </div>
      ) : (
        <div className="no-results">
          No expenses found for the selected filter.
        </div>
      )}
    </div>
  );
};

export default ExpenseReport;
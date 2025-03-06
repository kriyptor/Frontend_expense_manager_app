import React, { useState } from 'react';
import '../App.css';

const HomePage = () => {
  const [expenses, setExpenses] = useState([
    { id: 1, amount: 50, category: 'Food', description: 'Lunch', date: '2025-03-01' },
    { id: 2, amount: 100, category: 'Transport', description: 'Bus ticket', date: '2025-03-02' },
  ]);

  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: ''
  });

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = { ...formData, id: expenses.length + 1 };
    setExpenses([...expenses, newExpense]);
    setFormData({ amount: '', category: '', description: '', date: '' });
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = expenses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(expenses.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    const value = parseInt(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="homepage-container">
      <section className="form-section">
        <h2>Add New Expense</h2>
        <form className="expense-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount:</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="submit-btn">Add Expense</button>
        </form>
      </section>

      <section className="table-section">
        <h2>Expense History</h2>
        <div className="pagination-controls">
          <div className="items-per-page">
            <input
              type="number"
              min="1"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="items-per-page-input"
            />
            <button className="apply-btn">Apply</button>
          </div>
        </div>
        <div className="table-container">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Category</th>
                <th>Description</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(expense => (
                <tr key={expense.id}>
                  <td>{expense.amount}</td>
                  <td>{expense.category}</td>
                  <td>{expense.description}</td>
                  <td>{expense.date}</td>
                  <td>
                    <button onClick={() => handleDelete(expense.id)} className="delete-btn">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="pagination">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Prev
          </button>
          
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Last
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
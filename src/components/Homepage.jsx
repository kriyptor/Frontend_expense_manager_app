import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  InputGroup,
  Pagination,
  Alert
} from "react-bootstrap";

const HomePage = () => {
  // State for expense form
  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    category: "food",
    description: "",
    date: "",
  });

  const [userId, setUserId] = useState(null);
  
  // State for expenses data and pagination
  const [expenses, setExpenses] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  // State for custom items per page input
  const [customItemsPerPage, setCustomItemsPerPage] = useState(5);

  // State for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch expenses function - reusable for pagination and refresh
  const fetchExpenses = async (userId, page = 1, itemsPerPage = 5) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/expense/user-expense/${userId}`, {
        params: {
          page,
          limit: itemsPerPage
        }
      });
      
      // Update states with response data
      setExpenses(response.data.data);
      setPaginationInfo(response.data.pagination);
      setCustomItemsPerPage(response.data.pagination.itemsPerPage);
      setError(null);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setError("Failed to load expenses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Initial data load on component mount
  useEffect(() => {
    // Check for userId in localStorage
    const storedUserId = localStorage.getItem("userId");
    
    if (!storedUserId) {
      window.location.href = "/login";
      return;
    }
    
    setUserId(storedUserId);
    fetchExpenses(storedUserId, 1, customItemsPerPage);
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseForm({ ...expenseForm, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the new expense object
    const newExpense = {
      userId: userId,
      ...expenseForm,
    };

    try {
      setLoading(true);
      // Send the expense data to the server
      await axios.post("http://localhost:4000/expense/add-expense", newExpense);
      
      // Reset form after successful submission
      setExpenseForm({ amount: "", category: "food", description: "", date: "" });
      
      // Refresh the expense list to show the new entry
      fetchExpenses(userId, paginationInfo.currentPage, customItemsPerPage);
      
    } catch (error) {
      console.error("Error adding expense:", error);
      setError("Failed to add expense. Please try again.");
      setLoading(false);
    }
  };

  // Handle delete expense - updated to send both userId and expenseId
  const handleDelete = async (expenseId) => {
    try {
      setLoading(true);
      // Delete the expense from the server with the proper payload
      console.log(userId, expenseId)
      await axios.delete("http://localhost:4000/expense/delete-expense", {
        data: {
          userId: userId,
          expenseId: expenseId
        }
      });
      
      
      // Refresh the expense list after deletion
      fetchExpenses(userId, paginationInfo.currentPage, customItemsPerPage);
      
    } catch (error) {
      console.error("Error deleting expense:", error);
      setError("Failed to delete expense. Please try again.");
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    fetchExpenses(userId, pageNumber, customItemsPerPage);
  };

  // Handle rows per page change
  const handleItemsPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setCustomItemsPerPage(value);
  };

  // Apply the customItemsPerPage when the user submits
  const applyCustomPagination = () => {
    if (customItemsPerPage > 0) {
      fetchExpenses(userId, 1, customItemsPerPage); // Reset to first page when changing items per page
    }
  };

  return (
    <Container className="mt-5">
      {/* Error Alert */}
      {error && <Alert variant="danger">{error}</Alert>}
      
      {/* Expense Form */}
      <Row className="mb-4">
        <Col>
          <h3>Add Expense</h3>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={3}>
                <Form.Group controlId="amount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount"
                    name="amount"
                    value={expenseForm.amount}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={expenseForm.category}
                    onChange={handleInputChange}
                  >
                    <option value="food">Food</option>
                    <option value="fuel">Fuel</option>
                    <option value="clothes">Clothes</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter description"
                    name="description"
                    value={expenseForm.description}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="date">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={expenseForm.date}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button 
              variant="primary" 
              type="submit" 
              className="mt-3"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Add Expense'}
            </Button>
          </Form>
        </Col>
      </Row>

      {/* Expense Table */}
      <Row>
        <Col>
          <h3>Expense List</h3>
          {loading && <p>Loading expenses...</p>}
          
          {!loading && expenses.length === 0 ? (
            <p>No expenses found. Add your first expense using the form above.</p>
          ) : (
            <>
              <Table striped bordered hover responsive>
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
                  {expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>{expense.amount}</td>
                      <td>{expense.category}</td>
                      <td>{expense.description}</td>
                      <td>{expense.date}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(expense.id)}
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination Controls with Apply Button */}
              <Row className="align-items-center">
                <Col md={6}>
                  <InputGroup style={{ width: "300px" }}>
                    <Form.Control
                      type="number"
                      min="1"
                      value={customItemsPerPage}
                      onChange={handleItemsPerPageChange}
                      disabled={loading}
                    />
                    <InputGroup.Text>Rows per page</InputGroup.Text>
                    <Button 
                      variant="outline-secondary" 
                      onClick={applyCustomPagination}
                      disabled={loading}
                    >
                      Apply
                    </Button>
                  </InputGroup>
                  <div className="mt-2">
                    <small className="text-muted">
                      Showing {Math.min(paginationInfo.totalItems, (paginationInfo.currentPage - 1) * paginationInfo.itemsPerPage + 1)} 
                      - {Math.min(paginationInfo.currentPage * paginationInfo.itemsPerPage, paginationInfo.totalItems)} 
                      of {paginationInfo.totalItems} items
                    </small>
                  </div>
                </Col>
                <Col md={6} className="text-end">
                  <Pagination>
                    <Pagination.First 
                      onClick={() => handlePageChange(1)} 
                      disabled={!paginationInfo.hasPrevPage || loading}
                    />
                    <Pagination.Prev
                      onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
                      disabled={!paginationInfo.hasPrevPage || loading}
                    />
                    {[...Array(paginationInfo.totalPages).keys()].map((page) => (
                      <Pagination.Item
                        key={page + 1}
                        active={page + 1 === paginationInfo.currentPage}
                        onClick={() => handlePageChange(page + 1)}
                        disabled={loading}
                      >
                        {page + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
                      disabled={!paginationInfo.hasNextPage || loading}
                    />
                    <Pagination.Last 
                      onClick={() => handlePageChange(paginationInfo.totalPages)} 
                      disabled={!paginationInfo.hasNextPage || loading}
                    />
                  </Pagination>
                </Col>
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
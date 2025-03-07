import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Alert,
} from "react-bootstrap";

const ExpenseFilter = () => {
  const [userId, setUserId] = useState("");

  // Fetch userId from localStorage on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // State for form inputs
  const [filterType, setFilterType] = useState("daily"); // daily, monthly, yearly
  const [selectedDate, setSelectedDate] = useState(""); // For daily filtering
  const [selectedMonth, setSelectedMonth] = useState(""); // For monthly filtering
  const [selectedYear, setSelectedYear] = useState(""); // For yearly filtering

  // State for filtered expenses
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "filterType") {
      setFilterType(value);
    } else if (name === "selectedDate") {
      setSelectedDate(value);
    } else if (name === "selectedMonth") {
      setSelectedMonth(value);
    } else if (name === "selectedYear") {
      setSelectedYear(value);
    }
  };

  // Fetch daily expenses
  const fetchDailyExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:4000/expense/user-expense/day", {
        params: { userId, date: selectedDate },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching daily expenses:", error);
      return [];
    }
  };

  // Fetch monthly expenses
  const fetchMonthlyExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:4000/expense/user-expense/month", {
        params: { userId, month: selectedMonth },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching monthly expenses:", error);
      return [];
    }
  };

  // Fetch yearly expenses
  const fetchYearlyExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:4000/expense/user-expense/year", {
        params: { userId, year: selectedYear },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching yearly expenses:", error);
      return [];
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    let data = [];
    if (filterType === "daily" && selectedDate) {
      data = await fetchDailyExpenses();
    } else if (filterType === "monthly" && selectedMonth) {
      data = await fetchMonthlyExpenses();
    } else if (filterType === "yearly" && selectedYear) {
      data = await fetchYearlyExpenses();
    }

    setFilteredExpenses(data);
  };

  // Calculate total expense amount
  const totalExpense = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);

  return (
    <Container className="mt-5">
      {/* Filter Form */}
      <Row className="mb-4">
        <Col>
          <h3>Filter Expenses</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="filterType" className="mb-3">
              <Form.Label>Select Filter Type</Form.Label>
              <Form.Select
                name="filterType"
                value={filterType}
                onChange={handleInputChange}
              >
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </Form.Select>
            </Form.Group>

            {filterType === "daily" && (
              <Form.Group controlId="selectedDate" className="mb-3">
                <Form.Label>Select Date</Form.Label>
                <Form.Control
                  type="date"
                  name="selectedDate"
                  value={selectedDate}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            )}

            {filterType === "monthly" && (
              <Form.Group controlId="selectedMonth" className="mb-3">
                <Form.Label>Select Month (YYYY-MM)</Form.Label>
                <Form.Control
                  type="month"
                  name="selectedMonth"
                  value={selectedMonth}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            )}

            {filterType === "yearly" && (
              <Form.Group controlId="selectedYear" className="mb-3">
                <Form.Label>Select Year (YYYY)</Form.Label>
                <Form.Control
                  type="number"
                  name="selectedYear"
                  value={selectedYear}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            )}

            <Button variant="primary" type="submit">
              Apply Filter
            </Button>
          </Form>
        </Col>
      </Row>

      {/* Display Filtered Expenses */}
      {filteredExpenses.length > 0 ? (
        <Row>
          <Col>
            <Alert variant="info">
              Total Expense Amount: <strong>₹{totalExpense.toFixed(2)}</strong>
            </Alert>

            {/* Render table based on filter type */}
            <Table striped bordered hover>
              <thead>
                {filterType === "yearly" ? (
                  <tr>
                    <th>Sr.No.</th>
                    <th>Month</th>
                    <th>Total Expense</th>
                  </tr>
                ) : (
                  <tr>
                    <th>Sr.No.</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Description</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {filteredExpenses.map((expense, idx) => (
                  <tr key={expense.id}>
                    {filterType === "yearly" ? (
                      <>
                        <td>{idx + 1}</td>
                        <td>{expense.month}</td>
                        <td>₹{expense.amount}</td>
                      </>
                    ) : (
                      <>
                        <td>{idx + 1}</td>
                        <td>{expense.date}</td>
                        <td>₹{expense.amount}</td>
                        <td>{expense.category}</td>
                        <td>{expense.description}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      ) : (
        <Alert variant="warning">No expenses found for the selected criteria.</Alert>
      )}
    </Container>
  );
};

export default ExpenseFilter;
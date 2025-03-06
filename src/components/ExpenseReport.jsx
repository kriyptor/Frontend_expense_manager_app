import axios from "axios";
import React, {  useEffect, useState } from "react";
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

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);


  // Dummy expense data (pre-populated for testing)
  const initialExpenses = [
    { id: 1, amount: 50, category: "food", description: "Lunch", date: "2023-10-01" },
    { id: 2, amount: 30, category: "fuel", description: "Gas refill", date: "2023-10-02" },
    { id: 3, amount: 100, category: "clothes", description: "T-shirt", date: "2023-10-03" },
    { id: 4, amount: 20, category: "food", description: "Breakfast", date: "2023-10-01" },
    { id: 5, amount: 80, category: "fuel", description: "Diesel", date: "2023-09-15" },
    { id: 6, amount: 120, category: "clothes", description: "Shoes", date: "2022-12-25" },
    { id: 7, amount: 45, category: "food", description: "Dinner", date: "2023-10-05" },
    { id: 8, amount: 60, category: "fuel", description: "Petrol", date: "2023-09-20" },
    { id: 9, amount: 200, category: "clothes", description: "Jacket", date: "2022-11-10" },
    { id: 10, amount: 15, category: "food", description: "Snacks", date: "2023-10-01" },
    { id: 11, amount: 90, category: "fuel", description: "CNG", date: "2023-08-05" },
    { id: 12, amount: 75, category: "clothes", description: "Socks", date: "2021-07-15" },
    { id: 13, amount: 10, category: "food", description: "Coffee", date: "2023-10-02" },
    { id: 14, amount: 500, category: "fuel", description: "Monthly fuel", date: "2023-01-01" },
    { id: 15, amount: 300, category: "clothes", description: "Winter coat", date: "2020-12-01" },
  ];

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


/*************  ✨ Codeium Command ⭐  *************/
  /**
   * Fetches all expenses for a given year from the server.
   *
   * @return {Promise<Object[]>} A promise that resolves with an array of expense objects.
   */
/******  5a25548b-3d59-456a-a550-8501b0ec65e0  *******/
  const fetchYearlyExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:4000/expense/user-expense/year', {
        params: {
          userId: userId,
          year: selectedYear
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching yearly expenses:', error);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    let filtered = [];
    if (filterType === "daily" && selectedDate) {
      filtered = initialExpenses.filter((expense) => expense.date === selectedDate);
    } else if (filterType === "monthly" && selectedMonth) {
      filtered = initialExpenses.filter((expense) =>
        expense.date.startsWith(selectedMonth)
      );
    } else if (filterType === "yearly" && selectedYear) {
      fetchYearlyExpenses();
      console.log(filtered);
    }

    setFilteredExpenses(filtered);
  };

  // Calculate total expense amount
  /* const totalExpense = filteredExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  ); */



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
      {filteredExpenses.length > 0 && (
        <Row>
          <Col>
            <Alert variant="info">
              Total Expense Amount: <strong>${totalExpense.toFixed(2)}</strong>
            </Alert>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.id}</td>
                    <td>${expense.amount.toFixed(2)}</td>
                    <td>{expense.category}</td>
                    <td>{expense.description}</td>
                    <td>{expense.date}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}

      {/* No Results Message */}
      {filteredExpenses.length === 0 && (
        <Alert variant="warning">No expenses found for the selected criteria.</Alert>
      )}
    </Container>
  );
};

export default ExpenseFilter;
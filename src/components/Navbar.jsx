import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';

const ExpenseManagerNavbar = ({ isPremium, onLogout }) => {

  const navigate = useNavigate();  
  const [show, setShow] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      navigate('/'); // Redirect to login page
    }
  };

 isPremium = true;

  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky='top'>
      <Container>
        <Navbar.Brand href="/">Expense Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {isPremium ? (
              <Button variant="success" className="me-2">
                <NavDropdown 
                title="Premium Features" 
                id="premium-dropdown"
                show={show}
                onToggle={(isOpen) => setShow(isOpen)} 
              >
                <NavDropdown.Item onClick={() => navigate('/leaderboard')}>Leaderboard</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/report')}>Reports</NavDropdown.Item>
              </NavDropdown>
              </Button>
            ) : (
              <Button variant="warning" className="me-2">
                Buy Premium
              </Button>
            )}
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default ExpenseManagerNavbar;
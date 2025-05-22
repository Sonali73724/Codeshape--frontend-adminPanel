import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { FaUser, FaCog, FaSignOutAlt, FaBars } from 'react-icons/fa';

function TopNavbar({ toggleSidebarOnMobile }) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
      <Container fluid>
        <Button 
          variant="outline-light" 
          onClick={toggleSidebarOnMobile} 
          className="me-2 d-block d-md-none"
        >
          <FaBars />
        </Button>
        <Navbar.Brand href="/">Admin Dashboard</Navbar.Brand>
         <NavDropdown className='text-light'
              title={
                <span>
                  <FaUser className="me-2" />
                  CodeShape
                </span>
              } 
              id="basic-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item href="#profile">
                <FaUser className="me-2" />
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item href="#settings">
                <FaCog className="me-2" />
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#logout">
                <FaSignOutAlt className="me-2" />
                Logout
              </NavDropdown.Item>
            </NavDropdown>
        {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
       
      </Container>
    </Navbar>
  );
}

export default TopNavbar;
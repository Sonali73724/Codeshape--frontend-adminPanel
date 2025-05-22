import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';
import './NotFound.css'; // Make sure to create this CSS file

const NotFound = () => {
  return (
    <Container fluid className="not-found-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={8} lg={6}>
          <Card className="text-center not-found-card">
            <Card.Body>
              <div className="error-icon">
                <FaExclamationTriangle size={50} />
              </div>
              <h1 className="error-code">404</h1>
              <Card.Title className="mb-4 error-title">Oops! Page Not Found</Card.Title>
              <Card.Text className="error-message">
                The page you are looking for might have been removed, 
                had its name changed, or is temporarily unavailable.
              </Card.Text>
              <Link to="/" className="btn btn-primary btn-lg mt-3 home-button">
                <FaHome className="me-2" />
                Back to Homepage
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
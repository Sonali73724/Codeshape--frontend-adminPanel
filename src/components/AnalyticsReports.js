import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import Chart from 'chart.js/auto';
import { FaUser, FaChartLine, FaDollarSign } from 'react-icons/fa';
import axios from 'axios';

const AnalyticsReports = () => { 
  const [analyticsData, setAnalyticsData] = useState(null);
  const userActivityChartRef = useRef(null);
  const postPerformanceChartRef = useRef(null);
  const revenueChartRef = useRef(null);
  const chartInstancesRef = useRef({});

  useEffect(() => {
    fetchAnalyticsData();
    return () => {
      // Cleanup function to destroy charts when component unmounts
      Object.values(chartInstancesRef.current).forEach(chart => chart.destroy());
    };
  }, []);

  useEffect(() => {
    if (analyticsData) {
      createCharts();
    }
  }, [analyticsData]);

  const fetchAnalyticsData = async () => {
    try {
      const response = await axios.get('/analyticsData.json');
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const createCharts = () => {
    const { userActivity, postPerformance, revenue } = analyticsData;

    // Helper function to create or update a chart
    const createOrUpdateChart = (canvasRef, chartType, data, options) => {
      const ctx = canvasRef.current.getContext('2d');
      
      // Destroy existing chart if it exists
      if (chartInstancesRef.current[canvasRef.current.id]) {
        chartInstancesRef.current[canvasRef.current.id].destroy();
      }

      // Create new chart instance
      chartInstancesRef.current[canvasRef.current.id] = new Chart(ctx, {
        type: chartType,
        data: data,
        options: options
      });
    };

    // User Activity Chart
    createOrUpdateChart(userActivityChartRef, 'line', {
      labels: userActivity.labels,
      datasets: [{
        label: 'Active Users',
        data: userActivity.data,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    }, {
      responsive: true,
      maintainAspectRatio: false
    });

    // Post Performance Chart
    createOrUpdateChart(postPerformanceChartRef, 'bar', {
      labels: postPerformance.labels,
      datasets: [
        {
          label: 'Views',
          data: postPerformance.views,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: 'Likes',
          data: postPerformance.likes,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ]
    }, {
      responsive: true,
      maintainAspectRatio: false
    });

    // Revenue Chart
    createOrUpdateChart(revenueChartRef, 'pie', {
      labels: revenue.labels,
      datasets: [{
        data: revenue.data,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }]
    }, {
      responsive: true,
      maintainAspectRatio: false
    });
  };

  if (!analyticsData) return <div>Loading...</div>;

  const { loginHistory } = analyticsData;

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Analytics & Reports</h1>

      <Row className="g-4 mb-4">
        <Col lg={6}>
          <Card>
            <Card.Body>
              <Card.Title><FaUser className="me-2" />User Activity</Card.Title>
              <div style={{ height: '300px' }}>
                <canvas id="userActivityChart" ref={userActivityChartRef}></canvas>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <Card.Body>
              <Card.Title><FaChartLine className="me-2" />Post Performance</Card.Title>
              <div style={{ height: '300px' }}>
                <canvas id="postPerformanceChart" ref={postPerformanceChartRef}></canvas>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col lg={6}>
          <Card>
            <Card.Body>
              <Card.Title><FaDollarSign className="me-2" />Revenue by Product</Card.Title>
              <div style={{ height: '300px' }}>
                <canvas id="revenueChart" ref={revenueChartRef}></canvas>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <Card.Body>
              <Card.Title>Login History</Card.Title>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Login Time</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {loginHistory.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.user}</td>
                      <td>{entry.loginTime}</td>
                      <td>{entry.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AnalyticsReports;
import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge } from 'react-bootstrap';
import Chart from 'chart.js/auto';
import { FaMicrochip, FaMemory, FaHdd, FaUsers, FaCalendarAlt, FaFileAlt, FaUserCheck, FaChartLine, FaChartPie, FaServer } from 'react-icons/fa';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const visitorChartRef = useRef(null);
  const contentChartRef = useRef(null);
  const visitorChartInstanceRef = useRef(null);
  const contentChartInstanceRef = useRef(null);

  useEffect(() => {
    fetch('/dashboardData.json')
      .then(response => response.json())
      .then(data => setDashboardData(data));
  }, []);

  useEffect(() => {
    if (dashboardData) {
      const { visitorStats, contentInsights } = dashboardData;

      // Destroy existing charts if they exist
      if (visitorChartInstanceRef.current) {
        visitorChartInstanceRef.current.destroy();
      }
      if (contentChartInstanceRef.current) {
        contentChartInstanceRef.current.destroy();
      }

      // Visitor Chart
      const visitorCtx = visitorChartRef.current.getContext('2d');
      visitorChartInstanceRef.current = new Chart(visitorCtx, {
        type: 'line',
        data: {
          labels: visitorStats.labels,
          datasets: [{
            label: 'Daily Visitors',
            data: visitorStats.data,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        }
      });

      // Content Insights Chart
      const contentCtx = contentChartRef.current.getContext('2d');
      contentChartInstanceRef.current = new Chart(contentCtx, {
        type: 'pie',
        data: {
          labels: contentInsights.labels,
          datasets: [{
            data: contentInsights.data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
            ],
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        }
      });
    }
  }, [dashboardData]);

  useEffect(() => {
    return () => {
      if (visitorChartInstanceRef.current) {
        visitorChartInstanceRef.current.destroy();
      }
      if (contentChartInstanceRef.current) {
        contentChartInstanceRef.current.destroy();
      }
    };
  }, []);

  if (!dashboardData) return <div>Loading...</div>;

  const { cardData } = dashboardData;



  return (
    <Container fluid className="Dashboard py-4">
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h1 className="mb-0">
            <FaChartLine className="me-2 text-primary" />
            Welcome to Admin Dashboard
          </h1>
        </Card.Body>
      </Card>

      <Row className="g-4 mb-4">
        {[
          { title: "Today's Visitors", icon: FaUsers, value: cardData.todayVisitors, color: 'primary', trend: '+5%' },
          { title: "Monthly Visitors", icon: FaCalendarAlt, value: cardData.monthlyVisitors, color: 'success', trend: '+12%' },
          { title: "Total Posts", icon: FaFileAlt, value: cardData.totalPosts, color: 'info', trend: '+3' },
          { title: "Active Users", icon: FaUserCheck, value: cardData.activeUsers, color: 'warning', trend: '-2%' }
        ].map((item, index) => (
          <Col key={index} xs={12} sm={6} md={3}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className={`rounded-circle bg-${item.color} p-3`}>
                    <item.icon size={24} className="text-white" />
                  </div>
                  <Badge bg={item.trend.startsWith('+') ? 'success' : 'danger'} pill>
                    {item.trend}
                  </Badge>
                </div>
                <Card.Title className="mb-1">{item.title}</Card.Title>
                <Card.Text className="h2 mb-0 fw-bold text-dark">{item.value}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="d-flex align-items-center mb-4">
                <FaChartLine className="me-2 text-primary" />
                Daily Visitor Statistics
              </Card.Title>
              <div style={{ height: '300px' }}>
                <canvas ref={visitorChartRef}></canvas>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="d-flex align-items-center mb-4">
                <FaChartPie className="me-2 text-primary" />
                Content Insights
              </Card.Title>
              <div style={{ height: '300px' }}>
                <canvas ref={contentChartRef}></canvas>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="d-flex align-items-center mb-4">
            <FaServer className="me-2 text-primary" />
            System Performance
          </Card.Title>
          <Row className="g-4">
            {[
              { title: "CPU Usage", icon: FaMicrochip, value: 45, color: 'primary' },
              { title: "Memory Usage", icon: FaMemory, value: 60, color: 'success' },
              { title: "Disk Space", icon: FaHdd, value: 70, color: 'warning' }
            ].map((item, index) => (
              <Col key={index} md={4}>
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <div className={`rounded-circle bg-${item.color} p-3 me-3`}>
                        <item.icon className="text-white" size={24} />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1">{item.title}</h6>
                        <h4 className="mb-0">{item.value}%</h4>
                      </div>
                    </div>
                    <ProgressBar now={item.value} variant={item.color} className="mb-2" style={{height: '8px'}} />
                    <small className="text-muted">
                      {item.value < 50 ? 'Normal' : item.value < 80 ? 'Moderate' : 'High'} usage
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Dashboard;
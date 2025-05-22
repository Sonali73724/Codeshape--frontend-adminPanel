import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import './Sidebar.css';

function Sidebar({ isOpen }) {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  // const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  const toggleSubMenu = (index) => {
    setOpenSubMenu(openSubMenu === index ? null : index);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    { name: 'Dashboard', link: '/', icon: 'bi-speedometer2' },
    {
      name: 'User Management',
      icon: 'bi-people',
      subItems: [
        { name: 'All Users', link: '/users' },
        { name: 'Add User', link: '/users/add' },
        { name: 'Manage Roles', link: '/roles' }
      ],
    },
    {
      name: 'Content Management',
      icon: 'bi-file-earmark-text',
      subItems: [
        { name: 'Posts', link: '/content' },
        { name: 'New Post', link: '/newPost' },
        { name: 'Tags', link: '/tags' },
        { name: 'Edit Post', link: '/editPost/:id' },
        { name: 'categories', link: '/categories' },
        { name: 'taxonomy (tags and categories)', link: '/taxonomy' },
      ],
    },
    {
      name: 'Reporting & Analytics',
      icon: 'bi-graph-up',
      subItems: [
        { name: 'Analytics & Reports', link: '/analytics' }, 
        { name: 'Post Reports', link: '/post-reports' }, 
      ],

    },
    {
      name: 'pages',
      icon: 'bi-layout-sidebar-inset',
      subItems: [
        { name: '404 page', link: '/404' },
        { name: 'login page', link: '/login' },
      ],
    },

    { name: 'Settings', link: '/settings', icon: 'bi-gear' },
  ];

  useEffect(() => {
    menuItems.forEach((item, index) => {
      if (item.subItems && item.subItems.some(subItem => subItem.link === location.pathname)) {
        setOpenSubMenu(index);
      }
    });
  }, [location.pathname]);

  const isActive = (link) => {
    return location.pathname === link;
  };

  const isSubMenuActive = (subItems) => {
    return subItems.some(subItem => isActive(subItem.link));
  };

  return (
    <>


    <div className={`sidebar-wrapper ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar d-flex flex-column flex-shrink-0 p-3 text-white bg-dark">
          <div className="sidebar-brand d-flex align-items-center justify-content-center">
            <img src="/img/logo.png" alt="Logo" className="sidebar-logo me-2" />
            <span className="sidebar-brand-text">Admin Panel</span>
          </div>
          <ul className="nav nav-pills flex-column mb-auto pt-3">
            {menuItems.map((item, index) => (
              <li key={index} className="nav-item">
                {item.subItems ? (
                  <>
                    <a
                      href="#"
                      className={`nav-link text-white d-flex justify-content-between align-items-center ${isSubMenuActive(item.subItems) ? 'active2' : ''}`}
                      onClick={() => toggleSubMenu(index)}
                    >
                      <span>
                        <i className={`bi ${item.icon} me-2`}></i>
                        {item.name}
                      </span>
                      <i className={`bi bi-chevron-right chevron ${openSubMenu === index ? 'rotate' : ''}`}></i>
                    </a>
                    <ul className={`nav d-block sub-menu ${openSubMenu === index ? 'show' : ''}`}>
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link 
                            to={subItem.link} 
                            className={`nav-link ${isActive(subItem.link) ? 'active' : 'text-white'}`}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link 
                    to={item.link} 
                    className={`nav-link ${isActive(item.link) ? 'active' : 'text-white'}`}
                  >
                    <i className={`bi ${item.icon} me-2`}></i>
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
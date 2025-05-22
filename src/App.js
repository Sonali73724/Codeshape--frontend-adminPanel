import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Users from './components/Users';
import AddUserPage from './components/AddUserPage';
import ContentManagement from './components/ContentManagement';
import NewPostPage from './components/NewPostPage';
import RoleManagement from './components/RoleManagement';
import TopNavbar from './components/TopNavbar';
import AnalyticsReports from './components/AnalyticsReports';
import PostReports from './components/PostReports';
import NotFound from './components/NotFound';
import Login from './components/Login';
import TagManagement from './components/TagManagement';
import EditPostPage from './components/EditPostPage';
import CategoryManagement from './components/CategoryManagement';
import TaxonomyManagement from './components/TaxonomyManagement';
import SettingsPage from './components/SettingsPage';


import './App.css';

function App() {
const [sidebarOpen, setSidebarOpen] = useState(true);
    const [lastToggleTime, setLastToggleTime] = useState(0);


    useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebarOnBackgroundClick = useCallback((e) => {
    if (sidebarOpen && window.innerWidth < 768 && e.target.classList.contains('main-content')) {
      setSidebarOpen(false);
    }
  }, [sidebarOpen]);

   const toggleSidebarOnMobile = () => {
    console.log('toggle sidebar on mobile');
   
      setSidebarOpen(!sidebarOpen);
  };


  return (
    <Router>
      <div className="App ">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main 
          className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}
          onClick={closeSidebarOnBackgroundClick}
        >          <TopNavbar toggleSidebarOnMobile={toggleSidebarOnMobile} />

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/add" element={<AddUserPage />} />
            <Route path="/content" element={<ContentManagement />} />
            <Route path="/newPost" element={<NewPostPage />} />
            <Route path="/roles" element={<RoleManagement />} />
            <Route path="/analytics" element={<AnalyticsReports />} /> 
            <Route path="/post-reports" element={<PostReports />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tags" element={<TagManagement />} />
            <Route path="/editPost/:id" element={<EditPostPage />} />
            <Route path="/categories" element={<CategoryManagement />} />
            <Route path="/taxonomy" element={<TaxonomyManagement />} />
            <Route path="/settings" element={<SettingsPage />} />


            <Route path="/404" element={<NotFound />} /> 

            <Route path="*" element={<NotFound />} />
       
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
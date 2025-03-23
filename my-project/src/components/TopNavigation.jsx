import React from 'react';
import { Menu, User } from 'lucide-react';

const TopNavigation = ({ toggleSidebar, profileOpen, setProfileOpen }) => {
  return (
    <div className="top-nav">
      <div className="menu-toggle" onClick={toggleSidebar}>
        <Menu size={24} />
      </div>
      <div className="app-title">
        <h1>Mental Health Monitor</h1>
      </div>
      <div className="profile-section" onClick={() => setProfileOpen(!profileOpen)}>
        <User size={24} />
        {profileOpen && (
          <div className="profile-dropdown">
            <div className="profile-info">
              <div className="profile-avatar">
                <User size={40} />
              </div>
              <div className="profile-details">
                <h3>John Doe</h3>
                <p>john.doe@example.com</p>
              </div>
            </div>
            <div className="profile-menu">
              <div className="profile-menu-item">View Profile</div>
              <div className="profile-menu-item">Account Settings</div>
              <div className="profile-menu-item">Privacy Settings</div>
              <div className="profile-menu-item logout">Log Out</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNavigation;
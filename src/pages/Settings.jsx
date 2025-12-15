import { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  ShoppingBag, 
  Tag, 
  Monitor, 
  HelpCircle,
  ChevronRight,
  Globe
} from 'lucide-react';
import Sidebar from '../components/Sidebar.jsx'
import './Settings.css';

function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);

  const settingSections = [
    {
      title: 'Account',
      icon: <User className="icon" />,
      items: [
        { label: 'Profile Information', value: 'Edit' },
        { label: 'Contact Details', value: 'john@email.com' },
        { label: 'Location', value: 'New York, NY' },
        { label: 'Payment Methods', value: '2 cards' },
        { label: 'Linked Accounts', value: 'Manage' }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: <Lock className="icon" />,
      items: [
        { label: 'Change Password', value: '' },
      ]
    },
    {
      title: 'Notifications',
      icon: <Bell className="icon" />,
      items: [
        { 
          label: 'Push Notifications', 
          value: '', 
          toggle: true,
          state: notifications,
          setState: setNotifications
        },
        { 
          label: 'Email Notifications', 
          value: '', 
          toggle: true,
          state: emailNotifs,
          setState: setEmailNotifs
        },
        { label: 'New Messages', value: 'On' },
        { label: 'Price Drops', value: 'On' },
        { label: 'Marketing Emails', value: 'Off' }
      ]
    },
 
    {
      title: 'Support & Legal',
      icon: <HelpCircle className="icon" />,
      items: [
        { label: 'Help Center', value: '' },
        { label: 'Contact Support', value: '' },
        { label: 'Community Guidelines', value: '' },
        { label: 'Terms of Service', value: '' },
        { label: 'Privacy Policy', value: '' },
        { label: 'About Us', value: 'Version 2.4.1' }
      ]
    }
  ];

  return (
    <>
      <div className="settings-main-container">

        <Sidebar />
        <div className="settings-container">
          <div className="settings-wrapper">
            {/* Header */}
            <div className="settings-header">
              <h1 className="settings-title">Settings</h1>
              <p className="settings-subtitle">Manage your account and preferences</p>
            </div>

            {/* Settings Sections */}
            <div className="settings-sections">
              {settingSections.map((section, idx) => (
                <div key={idx} className="settings-section">
                  {/* Section Header */}
                  <div className="section-header">
                    <div className="section-icon">
                      {section.icon}
                    </div>
                    <h2 className="section-title">
                      {section.title}
                    </h2>
                  </div>

                  {/* Section Items */}
                  <div className="section-items">
                    {section.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="setting-item">
                        <div className="setting-label">
                          {item.icon && <div className="label-icon">{item.icon}</div>}
                          <span className="label-text">
                            {item.label}
                          </span>
                        </div>
                        
                        <div className="setting-value">
                          {item.toggle ? (
                            <button
                              onClick={() => item.setState(!item.state)}
                              className={`toggle-switch ${item.state ? 'active' : ''}`}
                            >
                              <div className="toggle-slider" />
                            </button>
                          ) : (
                            <>
                              {item.value && (
                                <span className="value-text">
                                  {item.value}
                                </span>
                              )}
                              <ChevronRight className="chevron-icon" />
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Logout Button */}
            <div className="logout-container">
              <button className="logout-button">Log Out</button>
            </div>

            {/* App Info */}
            <div className="app-info">
              <p>SecondLife Marketplace</p>
              <p className="copyright">© 2024 All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;

import { useState } from 'react';
import {
  User,
  Lock,
  Bell,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import Sidebar from '../components/Sidebar.jsx';
import ChangePasswordModal from '../components/ChangePasswordModal.jsx';
import { useAuth } from '../authContext';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

function Settings() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  if (!user || !token) {
    return (
      <div className="settings-main-container">
        <Sidebar />
        <div className="settings-container">
          <p>Please log in to access settings.</p>
        </div>
      </div>
    );
  }

  const settingSections = [
    {
      title: 'Account',
      icon: <User className="icon" />,
      items: [
        { label: 'Email', value: user.email || '' },
        { label: 'Phone number', value: user.phone_number || '' },
        { label: 'Payment Methods', value: '2 cards' },
        { label: 'Location', value: user.location || '' }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: <Lock className="icon" />,
      items: [
        {
          label: 'Change Password',
          value: '',
          action: 'changePassword'
        },
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

  const handleSettingClick = (item) => {
    if (item.action === 'changePassword') {
      setPasswordModalOpen(true);
    }
  };

  return (
    <>
      <div className="settings-main-container">
        <Sidebar />
        <div className="settings-container">
          <div className="settings-wrapper">
            <div className="settings-header">
              <h1 className="settings-title">Settings</h1>
              <p className="settings-subtitle">Manage your account and preferences</p>
            </div>

            <div className="settings-sections">
              {settingSections.map((section, idx) => (
                <div key={idx} className="settings-section">
                  <div className="section-header">
                    <div className="section-icon">
                      {section.icon}
                    </div>
                    <h2 className="section-title">
                      {section.title}
                    </h2>
                  </div>

                  <div className="section-items">
                    {section.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className={`setting-item ${item.action ? 'clickable' : ''}`}
                        onClick={() => item.action && handleSettingClick(item)}
                      >
                        <div className="setting-label">
                          {item.icon && <div className="label-icon">{item.icon}</div>}
                          <span className="label-text">
                            {item.label}
                          </span>
                        </div>

                        <div className="setting-value">
                          {item.toggle ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                item.setState(!item.state);
                              }}
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

            <div className="logout-container">
              <button onClick={() => { logout(); localStorage.removeItem("token"); navigate("/"); }} className="logout-button">Log Out</button>
            </div>

            <div className="app-info">
              <p>SecondLife Marketplace</p>
              <p className="copyright">© 2024 All rights reserved</p>
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        accessToken={token}
        onSuccess={() => {}}
      />
    </>
  );
}

export default Settings;

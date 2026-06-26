import { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import API_BASE_URL from '../config.js';
import './ChangePasswordModal.css';

function ChangePasswordModal({ isOpen, onClose, accessToken, onSuccess }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/changePassword`,
        {
          currentPassword,
          newPassword,
          confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to change password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Change Password</h2>
          <button
            onClick={onClose}
            className="close-button"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              disabled={isSubmitting}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;

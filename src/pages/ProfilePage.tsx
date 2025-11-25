import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button, useAuth } from '@psytor/astrogators-shared-ui';
import { Layout } from '../components/Layout';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, resendVerification } = useAuth();
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');

  if (!user) {
    return null;
  }

  const handleResendVerification = async () => {
    setResending(true);
    setResendMessage('');
    setResendError('');

    try {
      const message = await resendVerification({ email: user.email });
      setResendMessage(message);
    } catch (err: any) {
      setResendError(err.message || 'Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  return (
    <Layout>
      <div className="profile-page">
        <h1 className="profile-title">Your Profile</h1>

        <Card chamfered chamferSize="md" padding="lg" className="profile-card">
          <div className="profile-section">
            <h2 className="profile-section-title">Account Information</h2>
            <div className="profile-field">
              <span className="profile-field-label">Username:</span>
              <span className="profile-field-value">{user.username}</span>
            </div>
            <div className="profile-field">
              <span className="profile-field-label">Email:</span>
              <span className="profile-field-value">{user.email}</span>
            </div>
            <div className="profile-field">
              <span className="profile-field-label">Email Verified:</span>
              <div className="profile-field-value-group">
                <Badge variant={user.is_verified ? 'success' : 'warning'} size="sm">
                  {user.is_verified ? 'Verified' : 'Not Verified'}
                </Badge>
                {!user.is_verified && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleResendVerification}
                    loading={resending}
                  >
                    Resend Verification Email
                  </Button>
                )}
              </div>
            </div>
            {resendMessage && (
              <div className="profile-success-message">{resendMessage}</div>
            )}
            {resendError && <div className="profile-error-message">{resendError}</div>}
            <div className="profile-field">
              <span className="profile-field-label">Account Status:</span>
              <Badge variant={user.is_active ? 'success' : 'error'} size="sm">
                {user.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="profile-field">
              <span className="profile-field-label">Member Since:</span>
              <span className="profile-field-value">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>

        <Card chamfered chamferSize="md" padding="lg" className="profile-card">
          <div className="profile-section">
            <h2 className="profile-section-title">Security</h2>
            <p className="profile-section-description">Manage your account security settings</p>
            <div className="profile-actions">
              <Link to="/forgot-password" className="profile-action-link">
                Reset Password →
              </Link>
            </div>
          </div>
        </Card>

        <Card chamfered chamferSize="md" padding="lg" className="profile-card">
          <div className="profile-section">
            <h2 className="profile-section-title">Quick Links</h2>
            <p className="profile-section-description">
              Access the applications available to you
            </p>
            <div className="profile-links">
              <a href="/mod-ledger" className="profile-link-button">
                The Mod Ledger →
              </a>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

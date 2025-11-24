import { Card, Badge, useAuth } from '@psytor/astrogators-shared-ui';
import { Layout } from '../components/Layout';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

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
              <Badge variant={user.is_verified ? 'success' : 'warning'} size="sm">
                {user.is_verified ? 'Verified' : 'Not Verified'}
              </Badge>
            </div>
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

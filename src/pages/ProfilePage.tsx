import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button, Input, useAuth, formatAllyCode } from '@psytor/astrogators-shared-ui';
import { Layout } from '../components/Layout';
import './ProfilePage.css';

export default function ProfilePage() {
  const {
    user,
    resendVerification,
    allyCodes,
    addAllyCode,
    removeAllyCode,
    selectAllyCode,
    selectedAllyCode,
    isLoadingAllyCodes
  } = useAuth();
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');

  // Ally code management state
  const [newAllyCode, setNewAllyCode] = useState('');
  const [allyCodeError, setAllyCodeError] = useState('');
  const [allyCodeSuccess, setAllyCodeSuccess] = useState('');
  const [addingAllyCode, setAddingAllyCode] = useState(false);

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

  const handleAddAllyCode = async () => {
    setAllyCodeError('');
    setAllyCodeSuccess('');

    // Validate format
    if (!/^\d{9}$/.test(newAllyCode)) {
      setAllyCodeError('Ally code must be exactly 9 digits');
      return;
    }

    setAddingAllyCode(true);

    try {
      await addAllyCode(newAllyCode);
      setAllyCodeSuccess('Ally code added successfully!');
      setNewAllyCode('');
      setTimeout(() => setAllyCodeSuccess(''), 3000);
    } catch (err: any) {
      setAllyCodeError(err.message || 'Failed to add ally code');
    } finally {
      setAddingAllyCode(false);
    }
  };

  const handleRemoveAllyCode = async (allyCodeId: number | string) => {
    setAllyCodeError('');
    setAllyCodeSuccess('');

    try {
      await removeAllyCode(allyCodeId);
      setAllyCodeSuccess('Ally code removed successfully!');
      setTimeout(() => setAllyCodeSuccess(''), 3000);
    } catch (err: any) {
      setAllyCodeError(err.message || 'Failed to remove ally code');
    }
  };

  const handleSetActiveAllyCode = (allyCode: string) => {
    selectAllyCode(allyCode);
    setAllyCodeSuccess('Ally code set as active!');
    setTimeout(() => setAllyCodeSuccess(''), 2000);
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
            <h2 className="profile-section-title">Ally Codes</h2>
            <p className="profile-section-description">
              Manage your SWGOH ally codes. Add, remove, and set your active ally code.
            </p>

            {/* Add ally code form */}
            <div className="ally-code-add-section">
              <h3 className="ally-code-subsection-title">Add New Ally Code</h3>
              <div className="ally-code-input-group">
                <Input
                  type="text"
                  placeholder="Enter 9-digit ally code"
                  value={newAllyCode}
                  onChange={(e) => setNewAllyCode(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  disabled={addingAllyCode}
                />
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAddAllyCode}
                  loading={addingAllyCode}
                  disabled={newAllyCode.length !== 9}
                >
                  Add Ally Code
                </Button>
              </div>
              {allyCodeError && <div className="profile-error-message">{allyCodeError}</div>}
              {allyCodeSuccess && <div className="profile-success-message">{allyCodeSuccess}</div>}
            </div>

            {/* Ally codes list */}
            <div className="ally-code-list-section">
              <h3 className="ally-code-subsection-title">Your Ally Codes</h3>
              {isLoadingAllyCodes ? (
                <p className="ally-code-loading">Loading ally codes...</p>
              ) : allyCodes.length === 0 ? (
                <p className="ally-code-empty">No ally codes saved yet. Add one above to get started!</p>
              ) : (
                <div className="ally-code-list">
                  {allyCodes.map((code) => {
                    const isActive = code.ally_code === selectedAllyCode;
                    const codeId = 'id' in code ? code.id : code.ally_code;
                    return (
                      <div key={code.ally_code} className={`ally-code-item ${isActive ? 'active' : ''}`}>
                        <div className="ally-code-item-info">
                          <div className="ally-code-item-code">{formatAllyCode(code.ally_code)}</div>
                          {code.player_name && (
                            <div className="ally-code-item-name">{code.player_name}</div>
                          )}
                          {isActive && <Badge variant="success" size="sm">Active</Badge>}
                        </div>
                        <div className="ally-code-item-actions">
                          {!isActive && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleSetActiveAllyCode(code.ally_code)}
                            >
                              Set Active
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAllyCode(codeId)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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

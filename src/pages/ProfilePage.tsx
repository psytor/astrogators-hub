import { useState } from 'react';
import { Card, Badge, Button, Input, useAuth, formatAllyCode } from 'astrogators-shared-ui';
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
    isLoadingAllyCodes,
    updateAccount,
    logoutAll,
  } = useAuth();
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');

  // Ally code management state
  const [newAllyCode, setNewAllyCode] = useState('');
  const [allyCodeError, setAllyCodeError] = useState('');
  const [allyCodeSuccess, setAllyCodeSuccess] = useState('');
  const [addingAllyCode, setAddingAllyCode] = useState(false);

  // Change email
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailChanging, setEmailChanging] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  // Change password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChanging, setPasswordChanging] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Sign out everywhere
  const [signingOutAll, setSigningOutAll] = useState(false);

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

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');
    setEmailChanging(true);

    try {
      await updateAccount({ email: newEmail, current_password: emailPassword });
      setEmailSuccess('Email updated. Check your inbox to verify the new address.');
      setNewEmail('');
      setEmailPassword('');
    } catch (err: any) {
      setEmailError(err.message || 'Failed to update email');
    } finally {
      setEmailChanging(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordChanging(true);

    try {
      await updateAccount({ current_password: currentPassword, new_password: newPassword });
      setPasswordSuccess('Password updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setPasswordChanging(false);
    }
  };

  const handleLogoutAll = async () => {
    const confirmed = window.confirm(
      'Sign out of all devices? Every other browser and app session signed in to this account will be signed out too, including this one.'
    );
    if (!confirmed) return;

    setSigningOutAll(true);
    try {
      await logoutAll();
    } catch {
      // AuthContext.logoutAll() always finishes the LOCAL sign-out itself
      // (its own try/finally) even when the server request fails - there is
      // nothing more useful to show the user here than just completing the
      // redirect below.
    } finally {
      window.location.href = '/';
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

            <div className="security-subsection">
              <h3 className="ally-code-subsection-title">Change Email</h3>
              <form className="security-form" onSubmit={handleChangeEmail}>
                <Input
                  label="New Email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email address"
                  required
                  fullWidth
                />
                <Input
                  label="Current Password"
                  type="password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  placeholder="Confirm with your current password"
                  required
                  fullWidth
                />
                {emailError && <div className="profile-error-message">{emailError}</div>}
                {emailSuccess && <div className="profile-success-message">{emailSuccess}</div>}
                <Button type="submit" variant="secondary" size="md" loading={emailChanging}>
                  Update Email
                </Button>
              </form>
            </div>

            <div className="security-subsection">
              <h3 className="ally-code-subsection-title">Change Password</h3>
              <form className="security-form" onSubmit={handleChangePassword}>
                <Input
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                  fullWidth
                />
                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Upper + lower case, a number, a symbol, 8+ characters"
                  required
                  fullWidth
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Repeat the new password"
                  required
                  fullWidth
                />
                {passwordError && <div className="profile-error-message">{passwordError}</div>}
                {passwordSuccess && <div className="profile-success-message">{passwordSuccess}</div>}
                <Button type="submit" variant="secondary" size="md" loading={passwordChanging}>
                  Update Password
                </Button>
              </form>
            </div>

            <p className="security-note">
              Changing your email or password signs out every other device using this account —
              this one keeps working.
            </p>

            <div className="security-subsection security-subsection-danger">
              <h3 className="ally-code-subsection-title">Sign Out Everywhere</h3>
              <p className="profile-section-description">
                Immediately sign out this account on every device and browser, including this one.
              </p>
              <Button variant="outline" size="md" onClick={handleLogoutAll} loading={signingOutAll}>
                Sign Out of All Devices
              </Button>
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

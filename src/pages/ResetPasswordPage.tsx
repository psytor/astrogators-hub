import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Input, Button, useAuth } from 'astrogators-shared-ui';
import { Layout } from '../components/Layout';
import './AuthPage.css';

export default function ResetPasswordPage() {
  const { resetPassword, authEnabled, isLoadingFeatures } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if auth is disabled
  useEffect(() => {
    if (!isLoadingFeatures && !authEnabled) {
      navigate('/');
    }
  }, [authEnabled, isLoadingFeatures, navigate]);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
    }
  }, [token]);

  if (isLoadingFeatures) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      </Layout>
    );
  }

  if (!authEnabled) {
    return null; // Will redirect via useEffect
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        token,
        password,
        password_confirm: confirmPassword,
      });
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="auth-page">
          <Card chamfered chamferSize="md" padding="lg" className="auth-card">
            <h1 className="auth-title">Password Reset Successful!</h1>
            <p className="auth-subtitle">
              Your password has been updated. You will be redirected to the login page shortly.
            </p>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="auth-page">
        <Card chamfered chamferSize="md" padding="lg" className="auth-card">
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">Enter your new password below</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password (min 8 characters)"
              required
              fullWidth
              disabled={!token}
            />

            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              fullWidth
              disabled={!token}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={!token}
            >
              Reset Password
            </Button>
          </form>

          <div className="auth-footer">
            <Link to="/login" className="auth-link">
              Back to Login
            </Link>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

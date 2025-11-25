import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Input, Button, useAuth } from '@psytor/astrogators-shared-ui';
import { Layout } from '../components/Layout';
import './AuthPage.css';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await forgotPassword({ email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="auth-page">
          <Card chamfered chamferSize="md" padding="lg" className="auth-card">
            <h1 className="auth-title">Check Your Email</h1>
            <p className="auth-subtitle">
              We've sent a password reset link to <strong>{email}</strong>. Please check your
              inbox and follow the instructions to reset your password.
            </p>
            <Link to="/login">
              <Button variant="primary" size="lg" fullWidth>
                Back to Login
              </Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="auth-page">
        <Card chamfered chamferSize="md" padding="lg" className="auth-card">
          <h1 className="auth-title">Forgot Password?</h1>
          <p className="auth-subtitle">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              fullWidth
            />

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Send Reset Link
            </Button>
          </form>

          <div className="auth-footer">
            Remember your password?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

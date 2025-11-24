import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Input, Button, useAuth } from '@psytor/astrogators-shared-ui';
import { Layout } from '../components/Layout';
import './AuthPage.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await register({ email, username, password });
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="auth-page">
          <Card chamfered chamferSize="md" padding="lg" className="auth-card">
            <h1 className="auth-title">Registration Successful!</h1>
            <p className="auth-subtitle">
              Please check your email to verify your account. You will be redirected to the
              login page shortly.
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
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join The Astrogator's Table</p>

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

            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
              fullWidth
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password (min 8 characters)"
              required
              fullWidth
            />

            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              fullWidth
            />

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Create Account
            </Button>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

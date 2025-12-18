import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Button, Loader, apiClient, useAuth } from 'astrogators-shared-ui';
import { Layout } from '../components/Layout';
import './AuthPage.css';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const { authEnabled, isLoadingFeatures } = useAuth();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Redirect if auth is disabled
  useEffect(() => {
    if (!isLoadingFeatures && !authEnabled) {
      navigate('/');
    }
  }, [authEnabled, isLoadingFeatures, navigate]);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Invalid or missing verification token');
        setLoading(false);
        return;
      }

      try {
        await apiClient.post('/api/v1/auth/verify-email', { token });
        setSuccess(true);
      } catch (err: any) {
        setError(err.message || 'Failed to verify email. The link may have expired.');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
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

  return (
    <Layout>
      <div className="auth-page">
        <Card chamfered chamferSize="md" padding="lg" className="auth-card">
          {loading ? (
            <>
              <h1 className="auth-title">Verifying Email...</h1>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
                <Loader size="lg" />
              </div>
            </>
          ) : success ? (
            <>
              <h1 className="auth-title">Email Verified!</h1>
              <p className="auth-subtitle">
                Your email has been successfully verified. You can now sign in to your account.
              </p>
              <Link to="/login">
                <Button variant="primary" size="lg" fullWidth>
                  Go to Login
                </Button>
              </Link>
            </>
          ) : (
            <>
              <h1 className="auth-title">Verification Failed</h1>
              <div className="auth-error">{error}</div>
              <p className="auth-subtitle">
                If you continue to have issues, please contact support or request a new
                verification email.
              </p>
              <Link to="/login">
                <Button variant="outline" size="lg" fullWidth>
                  Back to Login
                </Button>
              </Link>
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
}

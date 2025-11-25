import { useState } from 'react';
import { Button, useAuth } from '@psytor/astrogators-shared-ui';
import './VerificationBanner.css';

export function VerificationBanner() {
  const { user, resendVerification } = useAuth();
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [dismissed, setDismissed] = useState(false);

  // Don't show banner if user is verified, not logged in, or dismissed
  if (!user || user.is_verified || dismissed) {
    return null;
  }

  const handleResend = async () => {
    setResending(true);
    setMessage('');

    try {
      const msg = await resendVerification({ email: user.email });
      setMessage(msg);
    } catch (err: any) {
      setMessage(err.message || 'Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verification-banner">
      <div className="verification-banner-content">
        <div className="verification-banner-icon">⚠️</div>
        <div className="verification-banner-text">
          <strong>Email not verified.</strong> Please check your email for a verification link.
          {message && <div className="verification-banner-message">{message}</div>}
        </div>
        <div className="verification-banner-actions">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleResend}
            loading={resending}
          >
            Resend Email
          </Button>
          <button
            className="verification-banner-dismiss"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

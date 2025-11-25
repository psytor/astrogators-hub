import { Link, useNavigate } from 'react-router-dom';
import { TopBar, Container, Footer, Button, useAuth } from '@psytor/astrogators-shared-ui';
import { VerificationBanner } from './VerificationBanner';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar
        logo={
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            The Astrogator's Table
          </Link>
        }
        rightContent={
          isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/profile" style={{ color: 'var(--color-text-secondary)' }}>
                {user?.username}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )
        }
      />
      <VerificationBanner />
      <main style={{ flex: 1 }}>
        <Container maxWidth="xl" padding>
          {children}
        </Container>
      </main>
      <Footer />
    </div>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { TopBar, Container, Footer, Button, AllyCodeDropdown, useAuth } from '@psytor/astrogators-shared-ui';
import { VerificationBanner } from './VerificationBanner';
import { AllyCodeMigrationBanner } from './AllyCodeMigrationBanner';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, isAuthenticated, logout, allyCodes } = useAuth();
  const navigate = useNavigate();

  console.log('Layout render - allyCodes:', allyCodes);

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AllyCodeDropdown />
            {isAuthenticated ? (
              <>
                <Link to="/profile" style={{ color: 'var(--color-text-secondary)' }}>
                  {user?.username}
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
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
            )}
          </div>
        }
      />
      <VerificationBanner />
      <AllyCodeMigrationBanner />
      <main style={{ flex: 1 }}>
        <Container maxWidth="xl" padding>
          {children}
        </Container>
      </main>
      <Footer />
    </div>
  );
}

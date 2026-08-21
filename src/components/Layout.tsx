import { NavBar, Container, Footer, useAuth } from 'astrogators-shared-ui';
import { VerificationBanner } from './VerificationBanner';
import { AllyCodeMigrationBanner } from './AllyCodeMigrationBanner';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  // Only admins see this — role management is admin-exclusive (see App.tsx's AdminRoute).
  const navItems = user?.role === 'admin' ? [{ label: 'Admin', href: '/admin/users' }] : undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Hub is the suite landing page: the logo is the identity, so no appName
          and no section tabs. NavBar bakes in the ally dropdown + auth cluster. */}
      <NavBar hubUrl="/" showAllyCode navItems={navItems} />
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

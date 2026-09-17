import { NavBar, Container, Footer } from 'astrogators-shared-ui';
import { VerificationBanner } from './VerificationBanner';
import { AllyCodeMigrationBanner } from './AllyCodeMigrationBanner';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* NavBar has no hub-specific trigger of its own — the logo is hub's
          only chrome here, and the Admin link (role === 'admin') is baked
          into NavBar's account cluster automatically, same on every app. */}
      <NavBar currentApp="hub" />
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

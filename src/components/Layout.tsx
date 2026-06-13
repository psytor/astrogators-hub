import { NavBar, Container, Footer } from 'astrogators-shared-ui';
import { VerificationBanner } from './VerificationBanner';
import { AllyCodeMigrationBanner } from './AllyCodeMigrationBanner';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Hub is the suite landing page: the logo is the identity, so no appName
          and no section tabs. NavBar bakes in the ally dropdown + auth cluster. */}
      <NavBar hubUrl="/" showAllyCode />
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

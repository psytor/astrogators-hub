import { Card, Badge } from '@psytor/astrogators-shared-ui';
import { Layout } from '../components/Layout';
import './HomePage.css';

interface Application {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'beta' | 'coming-soon';
  route: string;
}

const applications: Application[] = [
  {
    id: 'mod-ledger',
    name: 'The Mod Ledger',
    description: 'Analyze your mods and get intelligent recommendations on what to keep, slice, or sell. Upload your player data and let our evaluation system guide your mod management decisions.',
    status: 'available',
    route: '/mod-ledger',
  },
  {
    id: 'navicharts',
    name: 'Navicharts',
    description: 'Plan your farming roadmap with data-driven character recommendations. Build the optimal progression path based on your roster and goals.',
    status: 'coming-soon',
    route: '/navicharts',
  },
];

export default function HomePage() {
  const handleAppClick = (app: Application) => {
    if (app.status === 'available') {
      window.location.href = app.route;
    }
  };

  return (
    <Layout>
      <div className="home-page">
        <header className="home-header">
          <h1 className="home-title">The Astrogator's Table</h1>
          <p className="home-subtitle">
            Your command center for Star Wars: Galaxy of Heroes optimization tools
          </p>
        </header>

        <div className="app-grid">
          {applications.map((app) => (
            <Card
              key={app.id}
              chamfered
              chamferSize="lg"
              padding="lg"
              hoverable={app.status === 'available'}
              onClick={() => handleAppClick(app)}
              className="app-card"
            >
              <div className="app-card-header">
                <h2 className="app-card-title">{app.name}</h2>
                <Badge
                  variant={
                    app.status === 'available'
                      ? 'success'
                      : app.status === 'beta'
                      ? 'warning'
                      : 'default'
                  }
                  size="sm"
                >
                  {app.status === 'available'
                    ? 'Available'
                    : app.status === 'beta'
                    ? 'Beta'
                    : 'Coming Soon'}
                </Badge>
              </div>
              <p className="app-card-description">{app.description}</p>
              {app.status === 'available' && (
                <div className="app-card-footer">
                  <span className="app-card-link">Launch Application →</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}

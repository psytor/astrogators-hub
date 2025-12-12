import { useState } from 'react';
import { Zap, Map, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { Button, Card, useAuth } from 'astrogators-shared-ui';
import { Layout } from '../components/Layout';
import './HomePage.css';

interface Application {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'beta' | 'coming-soon';
  route: string;
  icon: typeof Zap;
  iconColor: string;
  features: string[];
}

const applications: Application[] = [
  {
    id: 'mod-ledger',
    name: 'Mod Ledger',
    description: 'Intelligent mod evaluation with advanced algorithms. Analyze your entire mod collection, identify keepers, and optimize your roster with data-driven recommendations.',
    status: 'available',
    route: '/mod-ledger/',
    icon: Zap,
    iconColor: '#3b82f6',
    features: [
      'Advanced evaluation algorithms',
      'Real-time mod processing',
      'Configurable evaluation rules',
    ],
  },
  {
    id: 'navicharts',
    name: 'Navicharts',
    description: 'Interactive farming roadmaps and progress tracking. Plan your character development, track farming progress, and optimize your galactic conquest strategy.',
    status: 'coming-soon',
    route: '/navicharts',
    icon: Map,
    iconColor: '#6b7280',
    features: [
      'Interactive farming roadmaps',
      'Progress tracking & analytics',
      'Galactic Conquest optimization',
    ],
  },
];

export default function HomePage() {
  const { allyCodes } = useAuth();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <Layout>
      <div className="home-page">
        {/* Content Container */}
        <div className="home-container">
          {/* Hero Section */}
          <div className="home-hero">
            <h1 className="home-title">The Astrogator's Table</h1>
            <p className="home-subtitle">
              Advanced SWGOH tools platform for mod evaluation, farming roadmaps, and roster optimization
            </p>
          </div>

          {/* Applications Grid */}
          <div className="app-grid">
            {applications.map((app) => {
              const Icon = app.icon;
              const isAvailable = app.status === 'available';
              const isHovered = hoveredCard === app.id;

              return (
                <div
                  key={app.id}
                  className={`app-card-wrapper ${!isAvailable ? 'disabled' : ''}`}
                  onMouseEnter={() => setHoveredCard(app.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Glow effect on hover */}
                  {isAvailable && isHovered && <div className="app-card-glow" />}

                  {/* Main Card */}
                  <Card chamfered chamferSize="md" padding="none" className="app-card">
                    {/* Icon and Title */}
                    <div className="app-card-header">
                      <div
                        className="app-icon-box"
                        style={{ backgroundColor: isAvailable ? app.iconColor : '#4b5563' }}
                      >
                        <Icon className="app-icon" />
                      </div>
                      <div>
                        <h3
                          className="app-card-title"
                          style={{ color: isAvailable ? app.iconColor : '#9ca3af' }}
                        >
                          {app.name}
                        </h3>
                        <p className={`app-status ${app.status}`}>
                          {app.status === 'available' ? 'Available Now' :
                           app.status === 'beta' ? 'Beta' : 'Coming Soon'}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="app-card-description">{app.description}</p>

                    {/* Features List */}
                    <div className="app-features">
                      {app.features.map((feature, index) => (
                        <div key={index} className="feature-item">
                          {isAvailable ? (
                            <CheckCircle className="feature-icon feature-icon-active" />
                          ) : (
                            <Clock className="feature-icon feature-icon-inactive" />
                          )}
                          <span className={isAvailable ? 'feature-text' : 'feature-text-inactive'}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    {isAvailable ? (
                      <a href={app.route} className="app-link">
                        <Button
                          variant="primary"
                          size="lg"
                          className="app-button"
                        >
                          Start Evaluating
                          <ArrowRight className="button-icon" />
                        </Button>
                      </a>
                    ) : (
                      <Button
                        variant="secondary"
                        size="lg"
                        disabled
                        className="app-button"
                      >
                        Coming Soon
                      </Button>
                    )}

                    {/* Continue with ally code button (for Mod Ledger only) */}
                    {app.id === 'mod-ledger' && allyCodes.length > 0 && (
                      <a href={`${app.route}?allyCode=${allyCodes[0].ally_code}`} className="app-link secondary">
                        <Button
                          variant="outline"
                          size="sm"
                          className="app-button-secondary"
                        >
                          Continue with {allyCodes[0].ally_code}
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Get Started Section */}
          <div className="get-started-section">
            <h2 className="get-started-title">Get Started in Seconds</h2>
            <div className="get-started-steps">
              <div className="step">
                <div className="step-number">1</div>
                <span className="step-text">Enter your ally code</span>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <span className="step-text">Choose evaluation settings</span>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <span className="step-text">Get instant recommendations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

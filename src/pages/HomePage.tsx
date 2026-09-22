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
  icon?: typeof Zap;
  iconImage?: string;
  iconColor: string;
  features: string[];
  cta: string;
}

const applications: Application[] = [
  {
    id: 'mod-ledger',
    name: 'Mod Ledger',
    description: 'Sorts your mods into Sell, Upgrade, or Pass. Use your own rules, or start from a set based on established SWGOH modding guides.',
    status: 'available',
    route: '/mod-ledger/',
    icon: Zap,
    iconColor: '#3b82f6',
    features: [
      'See the reasoning behind every verdict',
      'Share a rule set by link, or use ones already published',
      'Slicing advice with a quality rating per mod',
    ],
    cta: 'Start Evaluating',
  },
  {
    id: 'navicharts',
    name: 'Navicharts',
    description: 'Farming roadmaps that track your progress against your synced roster. Keep a chart private, share it with your guild or by link, or browse the curated library.',
    status: 'available',
    route: '/navicharts/',
    icon: Map,
    iconColor: '#3b82f6',
    features: [
      'Roster-aware — plans build around what you can already unlock',
      'Private, guild, link, or curated sharing',
      'Save example squads for each stage of the plan',
    ],
    cta: 'Start Planning',
  },
  {
    id: 'nightwatcher',
    name: 'Nightwatcher',
    description: 'A Discord bot that audits your SWGOH guild\'s daily tickets so officers don\'t have to.',
    status: 'available',
    route: '/nightwatcher/',
    iconImage: '/assets/images/nightwatcher.png',
    iconColor: '#3b82f6',
    features: [
      'Two snapshots a day, before and after your guild\'s reset',
      'A Discord report on who passed and who didn\'t',
      'Optional weekly/monthly summaries and excused-leave tracking',
    ],
    cta: 'View Guide',
  },
];

// Border colors for cards
const defaultBorderColor = '#374151'; // var(--color-border) equivalent (gray-700)
const hoverBorderColor = 'rgba(59, 130, 246, 0.5)'; // blue on hover

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
              SWGOH tools for mod evaluation, farming roadmaps, and guild auditing
            </p>
          </div>

          {/* Applications Grid */}
          <div className="app-grid">
            {applications.map((app) => {
              const Icon = app.icon;
              const isAvailable = app.status === 'available';
              const useImage = Boolean(app.iconImage);
              const isHovered = hoveredCard === app.id;

              const borderColor = isAvailable && isHovered ? hoverBorderColor : defaultBorderColor;

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
                  <Card
                    chamfered
                    chamferSize="lg"
                    showDiagonalBorders
                    edgeColor={borderColor}
                    padding="none"
                    className="app-card"
                  >
                    {/* Icon and Title */}
                    <div className="app-card-header">
                      {useImage ? (
                        <img
                          src={app.iconImage}
                          alt=""
                          className="app-icon-box app-icon-image"
                        />
                      ) : (
                        <div
                          className="app-icon-box"
                          style={{ backgroundColor: isAvailable ? app.iconColor : '#4b5563' }}
                        >
                          {Icon && <Icon className="app-icon" />}
                        </div>
                      )}
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
                          {app.cta}
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
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

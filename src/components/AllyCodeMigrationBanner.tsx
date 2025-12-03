import { useState } from 'react';
import { Button, useAuth } from 'astrogators-shared-ui';
import './AllyCodeMigrationBanner.css';

export function AllyCodeMigrationBanner() {
  const { user, migrationPrompt, dismissMigrationPrompt, migrateLocalStorageCodes } = useAuth();
  const [migrating, setMigrating] = useState(false);
  const [message, setMessage] = useState('');

  // Don't show banner if not logged in, no prompt, or no codes to migrate
  if (!user || !migrationPrompt.show || migrationPrompt.localStorageCodes.length === 0) {
    return null;
  }

  const handleMigrate = async () => {
    setMigrating(true);
    setMessage('');

    try {
      await migrateLocalStorageCodes();
      setMessage('Successfully migrated ally codes to your account!');
      setTimeout(() => {
        dismissMigrationPrompt();
      }, 2000);
    } catch (err: any) {
      setMessage(err.message || 'Failed to migrate ally codes');
      setMigrating(false);
    }
  };

  const codeCount = migrationPrompt.localStorageCodes.length;
  const codeText = codeCount === 1 ? 'ally code' : 'ally codes';

  return (
    <div className="migration-banner">
      <div className="migration-banner-content">
        <div className="migration-banner-icon">🔄</div>
        <div className="migration-banner-text">
          <strong>Migrate your ally codes?</strong> We found {codeCount} {codeText} saved locally.
          Save them to your account for access across devices.
          {message && <div className="migration-banner-message">{message}</div>}
        </div>
        <div className="migration-banner-actions">
          <Button
            variant="primary"
            size="sm"
            onClick={handleMigrate}
            loading={migrating}
          >
            Migrate Now
          </Button>
          <button
            className="migration-banner-dismiss"
            onClick={dismissMigrationPrompt}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

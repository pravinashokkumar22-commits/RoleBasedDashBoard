import { Settings } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="fade-in" style={{ maxWidth: 560 }}>
      <div className="card" style={{ padding: 28 }}>
        <div className="empty-state" style={{ padding: '40px 0' }}>
          <Settings size={40} />
          <p>Settings coming soon</p>
        </div>
      </div>
    </div>
  );
}

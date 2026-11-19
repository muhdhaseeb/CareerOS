import { Button } from '@careeros/ui';
import type { SystemHealth } from '@careeros/contracts';

const initialStatus: SystemHealth = {
  status: 'ok',
  version: '0.1.0',
  timestamp: new Date().toISOString(),
  uptimeSeconds: 0,
};

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#F7F7F7]">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-[#DDDDDD] p-6 text-center">
        <h1 className="text-2xl font-bold text-[#083859] mb-2">CareerOS</h1>
        <p className="text-sm text-[#6B7280] mb-6">
          AI-Powered Job Discovery &amp; Application Platform
        </p>
        <div className="bg-[#F7F7F7] p-3 rounded mb-6 text-xs text-left text-[#333333]">
          <div>
            System Status:{' '}
            <span className="font-semibold text-[#279B37]">{initialStatus.status}</span>
          </div>
          <div>
            Version: <span className="font-semibold">{initialStatus.version}</span>
          </div>
        </div>
        <Button variant="primary">Get Started</Button>
      </div>
    </main>
  );
}

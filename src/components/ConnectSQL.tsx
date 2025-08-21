import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const ConnectSQL: React.FC = () => {
  const [host, setHost] = useState('');
  const [port, setPort] = useState('5432');
  const [database, setDatabase] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [ssl, setSsl] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const canConnect = host.trim() !== '' && database.trim() !== '' && user.trim() !== '';

  const handleConnect = () => {
    if (!canConnect) {
      toast.error('Please fill host, database and user');
      return;
    }

    setIsConnecting(true);
    // Simulate a connect attempt — in real app this would call backend
    setTimeout(() => {
      setIsConnecting(false);
      toast('Coming soon');
    }, 800);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Connect to an existing SQL database</h3>
      <p className="text-sm text-muted-foreground mb-4">Fill the connection details and press Connect. (This is a placeholder UI.)</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-muted-foreground block mb-1">Host</label>
          <Input value={host} onChange={(e) => setHost(e.target.value)} placeholder="db.example.com" />
        </div>

        <div>
          <label className="text-sm text-muted-foreground block mb-1">Port</label>
          <Input value={port} onChange={(e) => setPort(e.target.value)} placeholder="5432" />
        </div>

        <div>
          <label className="text-sm text-muted-foreground block mb-1">Database</label>
          <Input value={database} onChange={(e) => setDatabase(e.target.value)} placeholder="my_database" />
        </div>

        <div>
          <label className="text-sm text-muted-foreground block mb-1">User</label>
          <Input value={user} onChange={(e) => setUser(e.target.value)} placeholder="db_user" />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-muted-foreground block mb-1">Password</label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type="password" />
        </div>

        <div className="flex items-center space-x-3 md:col-span-2">
          <Switch checked={ssl} onCheckedChange={(v) => setSsl(!!v)} />
          <div>
            <div className="text-sm text-foreground">Use SSL</div>
            <div className="text-xs text-muted-foreground">Enable TLS/SSL for the connection</div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-3">
        <Button onClick={handleConnect} disabled={!canConnect || isConnecting} className="bg-gradient-primary">
          {isConnecting ? 'Connecting…' : 'Connect'}
        </Button>
        <Button variant="ghost" onClick={() => { setHost(''); setPort('5432'); setDatabase(''); setUser(''); setPassword(''); setSsl(false); }}>
          Reset
        </Button>
      </div>
    </Card>
  );
};

export default ConnectSQL;

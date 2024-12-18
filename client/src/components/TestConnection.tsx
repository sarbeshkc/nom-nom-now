import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function TestConnection() {
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const checkConnection = async () => {
    setApiStatus('loading');
    try {
      const response = await api.get('/health');
      setMessage(response.data.message);
      setApiStatus('success');
    } catch (error) {
      setMessage('Failed to connect to API');
      setApiStatus('error');
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">System Status</h2>
            <div className={`
              inline-block px-2 py-1 rounded-full text-sm
              ${apiStatus === 'success' ? 'bg-green-100 text-green-800' : ''}
              ${apiStatus === 'error' ? 'bg-red-100 text-red-800' : ''}
              ${apiStatus === 'loading' ? 'bg-yellow-100 text-yellow-800' : ''}
            `}>
              {apiStatus.toUpperCase()}
            </div>
          </div>

          <div className="text-center text-gray-600">
            {message}
          </div>

          <div className="text-center">
            <Button
              onClick={checkConnection}
              disabled={apiStatus === 'loading'}
            >
              Test Connection
            </Button>
          </div>

          <div className="text-sm text-gray-500">
            API URL: {import.meta.env.VITE_API_URL}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
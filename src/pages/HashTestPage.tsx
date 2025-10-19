import { useState } from 'react';

export default function HashTestPage() {
  const [result, setResult] = useState('');

  const updatePassword = async () => {
    try {
      // Обновляем пароль через API
      const response = await fetch('https://functions.poehali.dev/65d57cf7-a248-416f-87f1-477b145f13c2', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 7,
          password: '3Dyzaape29938172'
        })
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-900 p-8 text-white">
      <h1 className="text-2xl mb-4">Password Update Test</h1>
      <button
        onClick={updatePassword}
        className="px-4 py-2 bg-gold-500 text-charcoal-900 rounded"
      >
        Update Admin Password
      </button>
      <pre className="mt-4 bg-charcoal-800 p-4 rounded">{result}</pre>
    </div>
  );
}

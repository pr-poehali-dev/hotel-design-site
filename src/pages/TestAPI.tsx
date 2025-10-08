import { useState, useEffect } from 'react';
import func2url from '../../backend/func2url.json';

const TestAPI = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = func2url['cleaning-history'];
      console.log('🔍 Запрос к API:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);
      
      const text = await response.text();
      console.log('📡 Response text:', text);
      
      const json = JSON.parse(text);
      console.log('📡 Response JSON:', json);
      
      setData(json);
    } catch (err: any) {
      console.error('❌ Ошибка:', err);
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', background: '#1a1a1a', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ color: '#ffd700' }}>🔍 Тест API cleaning-history</h1>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={loadData}
          style={{
            background: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🔄 Обновить данные
        </button>
      </div>

      {loading && (
        <div style={{ marginTop: '20px', color: '#FFD700' }}>
          ⏳ Загрузка...
        </div>
      )}

      {error && (
        <div style={{ marginTop: '20px', padding: '20px', background: '#ff4444', borderRadius: '8px' }}>
          <h2>❌ Ошибка</h2>
          <pre>{error}</pre>
        </div>
      )}

      {data && (
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ color: '#4CAF50' }}>✅ Ответ от API:</h2>
          <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', marginTop: '10px' }}>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>

          {data.success && data.records && (
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ color: '#FFD700' }}>📋 Записи ({data.records.length}):</h3>
              {data.records.map((record: any, index: number) => (
                <div 
                  key={index}
                  style={{ 
                    background: '#333', 
                    padding: '15px', 
                    borderRadius: '8px', 
                    marginTop: '10px',
                    border: '1px solid #555'
                  }}
                >
                  <div><strong>ID:</strong> {record.id}</div>
                  <div><strong>Номер:</strong> {record.roomNumber}</div>
                  <div><strong>Горничная:</strong> {record.housekeeperName}</div>
                  <div><strong>Сумма:</strong> {record.payment} ₽</div>
                  <div><strong>Статус:</strong> {record.paymentStatus}</div>
                  <div><strong>Дата уборки:</strong> {record.cleanedAt}</div>
                  <div><strong>Дата выплаты:</strong> {record.paidAt || 'не выплачено'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '40px', padding: '20px', background: '#2a2a2a', borderRadius: '8px' }}>
        <h3>📌 Информация о подключении:</h3>
        <div><strong>API URL:</strong> {func2url['cleaning-history']}</div>
        <div style={{ marginTop: '10px' }}><strong>Время:</strong> {new Date().toLocaleString('ru-RU')}</div>
      </div>
    </div>
  );
};

export default TestAPI;

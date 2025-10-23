import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GuestManagementPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/admin-dashboard', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-white text-xl">Перенаправление...</div>
      </div>
    </div>
  );
}

import { useState, useMemo, useEffect } from 'react';
import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';
import StatsCards from '@/components/housekeeping/StatsCards';
import FilterBar from '@/components/housekeeping/FilterBar';
import AddRoomForm from '@/components/housekeeping/AddRoomForm';
import RoomsTable from '@/components/housekeeping/RoomsTable';
import HistoryPanel from '@/components/housekeeping/HistoryPanel';
import LoginForm from '@/components/auth/LoginForm';
import HousekeepersManager from '@/components/housekeeping/HousekeepersManager';
import PageHeader from '@/components/housekeeping/PageHeader';
import PaymentsReport from '@/components/housekeeping/PaymentsReport';
import HousekeeperHistory from '@/components/housekeeping/HousekeeperHistory';
import AdminCleaningHistory from '@/components/housekeeping/AdminCleaningHistory';
import { Room } from '@/components/housekeeping/types';
import { useAuth } from '@/hooks/useAuth';
import { useRooms } from '@/hooks/useRooms';
import { useHousekeepers } from '@/hooks/useHousekeepers';
import { useHistory } from '@/hooks/useHistory';
import { useCleaningRecords } from '@/hooks/useCleaningRecords';

const HousekeepingTable = () => {
  const {
    user,
    loginError,
    handleLogin,
    handleLogout,
  } = useAuth();

  const {
    rooms,
    setRooms,
    editingRoomId,
    newRoom,
    setNewRoom,
    updateRoomStatus,
    assignHousekeeper,
    addRoom,
    deleteRoom,
    startEditRoom,
    saveEditRoom,
    updateRoomField,
    loading: roomsLoading,
    reload: reloadRooms
  } = useRooms();

  const {
    housekeepers,
    newHousekeeperName,
    setNewHousekeeperName,
    addHousekeeper,
    deleteHousekeeper,
    updateHousekeeper,
    loading: housekeepersLoading,
    reload: reloadHousekeepers
  } = useHousekeepers(rooms, setRooms);

  const {
    history,
    saveToHistory,
    loadFromHistory,
    deleteFromHistory,
  } = useHistory(rooms, setRooms);

  const {
    records,
    addCleaningRecord,
    markAsPaid,
    updatePaymentStatus,
    getRecordsByHousekeeper
  } = useCleaningRecords();

  const [filter, setFilter] = useState<'all' | 'clean' | 'dirty' | 'in-progress' | 'inspection' | 'turnover' | 'occupied'>('all');
  const [selectedHousekeeper, setSelectedHousekeeper] = useState<string>('all');
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [isManagingHousekeepers, setIsManagingHousekeepers] = useState(false);
  const [showPaymentsReport, setShowPaymentsReport] = useState(false);
  const [lastSync, setLastSync] = useState<Date>(new Date());

  const isAdmin = user?.role === 'admin' || false;

  // Автообновление данных каждые 10 секунд
  useEffect(() => {
    if (!user) return;

    const intervalId = setInterval(() => {
      reloadRooms();
      reloadHousekeepers();
      setLastSync(new Date());
    }, 10000); // 10 секунд

    return () => clearInterval(intervalId);
  }, [user, reloadRooms, reloadHousekeepers]);

  const filteredRooms = useMemo(() => {
    console.log('Фильтрация комнат:', {
      totalRooms: rooms.length,
      user: user,
      isAdmin,
      filter,
      selectedHousekeeper
    });
    
    return rooms.filter(room => {
      const statusMatch = filter === 'all' || room.status === filter;
      
      // Для горничных показываем только их апартаменты
      if (!isAdmin && user?.role === 'housekeeper') {
        const match = statusMatch && room.assignedTo === user.username;
        console.log('Проверка комнаты для горничной:', {
          roomNumber: room.number,
          roomAssignedTo: room.assignedTo,
          username: user.username,
          statusMatch,
          finalMatch: match
        });
        return match;
      }
      
      // Для админа работает обычный фильтр
      const housekeeperMatch = selectedHousekeeper === 'all' || room.assignedTo === selectedHousekeeper;
      return statusMatch && housekeeperMatch;
    });
  }, [rooms, filter, selectedHousekeeper, isAdmin, user]);

  const stats = useMemo(() => ({
    total: rooms.length,
    clean: rooms.filter(r => r.status === 'clean').length,
    dirty: rooms.filter(r => r.status === 'dirty').length,
    inProgress: rooms.filter(r => r.status === 'in-progress').length,
    inspection: rooms.filter(r => r.status === 'inspection').length,
    turnover: rooms.filter(r => r.status === 'turnover').length,
    occupied: rooms.filter(r => r.status === 'occupied').length
  }), [rooms]);

  // Обёртка для updateRoomStatus, чтобы записывать историю уборок
  const handleUpdateRoomStatus = async (roomId: string, newStatus: Room['status']) => {
    const room = rooms.find(r => r.id === roomId);
    
    console.log('handleUpdateRoomStatus called:', { roomId, newStatus, room, assignedTo: room?.assignedTo, payment: room?.payment });
    
    // Если комната переведена в статус "clean", записываем в историю
    if (newStatus === 'clean' && room && room.assignedTo) {
      console.log('Creating cleaning record:', room.number, room.assignedTo, room.payment);
      addCleaningRecord(room.number, room.assignedTo, room.payment || 0);
    }
    
    await updateRoomStatus(roomId, newStatus);
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} error={loginError} />;
  }

  if (roomsLoading || housekeepersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <PageHeader user={user} isAdmin={isAdmin} onLogout={handleLogout} lastSync={lastSync} />

        {!isAdmin && user?.role === 'housekeeper' && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-6 shadow-xl">
            <div className="flex items-center gap-3">
              <Icon name="User" size={28} className="text-white" />
              <div>
                <h2 className="text-white text-xl font-bold">Мои закреплённые апартаменты</h2>
                <p className="text-blue-100 text-sm mt-1">
                  Показаны только апартаменты, закрепленные за вами: {user.username}
                </p>
              </div>
            </div>
          </div>
        )}

        <StatsCards stats={stats} />

        {isAdmin && (
          <>
            <div className="mb-6 flex gap-3 flex-wrap">
              <FizzyButton
                onClick={() => {
                  reloadRooms();
                  reloadHousekeepers();
                  setLastSync(new Date());
                }}
                icon={<Icon name="RefreshCw" size={20} />}
                variant="secondary"
              >
                Обновить данные
              </FizzyButton>
              <FizzyButton
                onClick={saveToHistory}
                icon={<Icon name="Save" size={20} />}
              >
                Сохранить в историю
              </FizzyButton>
              <FizzyButton
                onClick={() => setIsManagingHousekeepers(!isManagingHousekeepers)}
                icon={<Icon name="Users" size={20} />}
                variant="secondary"
              >
                {isManagingHousekeepers ? 'Закрыть' : 'Управление клинерами'}
              </FizzyButton>
              <FizzyButton
                onClick={() => setShowPaymentsReport(!showPaymentsReport)}
                icon={<Icon name="Wallet" size={20} />}
                variant="secondary"
              >
                {showPaymentsReport ? 'Скрыть' : 'Отчёт по выплатам'}
              </FizzyButton>
            </div>
          </>
        )}

        {isAdmin && isManagingHousekeepers && (
          <HousekeepersManager
            housekeepers={housekeepers}
            newHousekeeperName={newHousekeeperName}
            setNewHousekeeperName={setNewHousekeeperName}
            onAddHousekeeper={addHousekeeper}
            onDeleteHousekeeper={deleteHousekeeper}
            onUpdateHousekeeper={updateHousekeeper}
          />
        )}

        {isAdmin && (
          <HistoryPanel
            history={history}
            onLoadHistory={loadFromHistory}
            onDeleteHistory={deleteFromHistory}
          />
        )}

        {isAdmin && showPaymentsReport && (
          <PaymentsReport rooms={rooms} />
        )}

        <FilterBar
          filter={filter}
          setFilter={setFilter}
          selectedHousekeeper={selectedHousekeeper}
          setSelectedHousekeeper={setSelectedHousekeeper}
          housekeepers={housekeepers}
          onAddRoom={isAdmin ? () => setIsAddingRoom(true) : undefined}
        />

        {isAdmin && isAddingRoom && (
          <AddRoomForm
            newRoom={newRoom}
            setNewRoom={setNewRoom}
            housekeepers={housekeepers}
            onSave={addRoom}
            onCancel={() => setIsAddingRoom(false)}
          />
        )}

        <RoomsTable
          rooms={filteredRooms}
          housekeepers={housekeepers}
          editingRoomId={editingRoomId}
          onUpdateStatus={handleUpdateRoomStatus}
          onAssignHousekeeper={assignHousekeeper}
          onStartEdit={isAdmin ? startEditRoom : () => {}}
          onSaveEdit={saveEditRoom}
          onUpdateField={updateRoomField}
          onDelete={isAdmin ? deleteRoom : () => {}}
          isAdmin={isAdmin}
        />

        {!isAdmin && user?.role === 'housekeeper' && (
          <div className="mt-8">
            <HousekeeperHistory 
              records={getRecordsByHousekeeper(user.username)} 
              isAdmin={false}
            />
          </div>
        )}

        {isAdmin && (
          <div className="mt-8">
            <AdminCleaningHistory 
              records={records}
              onUpdatePaymentStatus={updatePaymentStatus}
            />
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <FizzyButton
            onClick={() => window.location.href = '/'}
            variant="secondary"
            icon={<Icon name="Home" size={20} />}
          >
            Вернуться на главную
          </FizzyButton>
        </div>
      </div>
    </div>
  );
};

export default HousekeepingTable;
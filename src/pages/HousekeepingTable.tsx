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
import NotificationToast from '@/components/housekeeping/NotificationToast';
import { Room } from '@/components/housekeeping/types';
import { useAuth } from '@/hooks/useAuth';
import { useRooms } from '@/hooks/useRooms';
import { useHousekeepers } from '@/hooks/useHousekeepers';
import { useHistory } from '@/hooks/useHistory';
import { useCleaningRecords } from '@/hooks/useCleaningRecords';
import { useNotifications } from '@/hooks/useNotifications';
import { usePersistentNotifications } from '@/hooks/usePersistentNotifications';

const HousekeepingTable = () => {
  const {
    user,
    loginError,
    handleLogin,
    handleLogout,
  } = useAuth();

  const {
    notifications,
    showNotification,
    removeNotification
  } = useNotifications();

  const {
    persistentNotifications,
    saveNotification: savePersistentNotification,
    markAsRead
  } = usePersistentNotifications(user?.username || '');

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
    deleteAllRooms,
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
    loading: recordsLoading,
    addCleaningRecord,
    markAsPaid,
    updatePaymentStatus,
    getRecordsByHousekeeper,
    deleteRecord,
    reload: reloadRecords
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
      reloadRecords();
      setLastSync(new Date());
    }, 10000); // 10 секунд

    return () => clearInterval(intervalId);
  }, [user, reloadRooms, reloadHousekeepers, reloadRecords]);

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
    cleaned: rooms.filter(r => r.status === 'cleaned').length,
    pendingVerification: rooms.filter(r => r.status === 'pending-verification').length,
    inspection: rooms.filter(r => r.status === 'inspection').length,
    turnover: rooms.filter(r => r.status === 'turnover').length,
    occupied: rooms.filter(r => r.status === 'occupied').length
  }), [rooms]);

  // Обёртка для updateRoomStatus, чтобы записывать историю уборок
  const handleUpdateRoomStatus = async (roomId: string, newStatus: Room['status']) => {
    const room = rooms.find(r => r.id === roomId);
    
    console.log('🎯 handleUpdateRoomStatus called:', { 
      roomId, 
      newStatus, 
      roomNumber: room?.number,
      assignedTo: room?.assignedTo, 
      payment: room?.payment, 
      currentStatus: room?.status,
      isAdmin 
    });
    
    // Если горничная нажала "Убрано", переводим в статус "На проверке"
    if (newStatus === 'cleaned' && room && room.assignedTo) {
      console.log('🔄 Горничная отправила на проверку:', room.number);
      await updateRoomStatus(roomId, 'pending-verification');
      if (!isAdmin) {
        showNotification(
          `Апартамент ${room.number} отправлен на проверку администратору`,
          'info'
        );
      } else {
        showNotification(
          `${room.assignedTo} отправил(а) апартамент ${room.number} на проверку`,
          'info'
        );
      }
      return;
    }
    
    // Если админ подтверждает любой статус (кроме dirty) -> "Чисто" и есть горничная, записываем в историю
    if (newStatus === 'clean' && room && room.assignedTo) {
      // Проверяем, что это не просто установка чисто с грязного (должна быть уборка)
      const shouldRecord = room.status === 'pending-verification' || 
                          room.status === 'cleaned' || 
                          room.status === 'in-progress';
      
      console.log('🧹 Проверка создания записи:', { 
        shouldRecord, 
        currentStatus: room.status,
        roomNumber: room.number,
        housekeeper: room.assignedTo,
        payment: room.payment 
      });
      
      if (shouldRecord) {
        console.log('✨ Creating cleaning record:', room.number, room.assignedTo, room.payment);
        addCleaningRecord(room.number, room.assignedTo, room.payment || 0);
        
        if (isAdmin) {
          const notificationMessage = `✅ Уборка апартамента ${room.number} подтверждена! Начислено ${room.payment || 0} ₽`;
          
          showNotification(notificationMessage, 'success');
          
          savePersistentNotification(
            notificationMessage,
            'success',
            room.assignedTo
          );
        }
        
        // ВАЖНО: После подтверждения уборки открепляем апартамент от горничной
        console.log('🔓 Открепляем апартамент от горничной:', room.number);
        await assignHousekeeper(roomId, '');
      }
    }
    
    await updateRoomStatus(roomId, newStatus);
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} error={loginError} />;
  }

  if (roomsLoading || housekeepersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg sm:text-xl font-semibold">Загрузка данных...</p>
          <p className="text-gray-400 text-sm sm:text-base mt-2">Пожалуйста, подождите</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <PageHeader 
          user={user} 
          isAdmin={isAdmin} 
          onLogout={handleLogout} 
          lastSync={lastSync}
          unreadNotifications={persistentNotifications.length}
        />

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
                  reloadRecords();
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
              <FizzyButton
                onClick={deleteAllRooms}
                icon={<Icon name="Trash2" size={20} />}
                variant="destructive"
              >
                Очистить всю базу
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
          <PaymentsReport 
            records={records}
            onUpdatePaymentStatus={updatePaymentStatus}
          />
        )}

        <FilterBar
          filter={filter}
          setFilter={setFilter}
          selectedHousekeeper={selectedHousekeeper}
          setSelectedHousekeeper={setSelectedHousekeeper}
          housekeepers={housekeepers}
          onAddRoom={isAdmin ? () => setIsAddingRoom(true) : undefined}
          isAdmin={isAdmin}
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
              onDeleteRecord={deleteRecord}
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

        {notifications.map(notification => (
          <NotificationToast
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
        
        {persistentNotifications.map(notification => (
          <NotificationToast
            key={notification.id}
            message={notification.message}
            type={notification.type}
            duration={10000}
            onClose={() => markAsRead(notification.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default HousekeepingTable;
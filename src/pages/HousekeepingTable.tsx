import { useState } from 'react';
import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';
import StatsCards from '@/components/housekeeping/StatsCards';
import FilterBar from '@/components/housekeeping/FilterBar';
import AddRoomForm from '@/components/housekeeping/AddRoomForm';
import RoomsTable from '@/components/housekeeping/RoomsTable';
import HistoryPanel from '@/components/housekeeping/HistoryPanel';
import LoginForm from '@/components/auth/LoginForm';
import UserManagement from '@/components/auth/UserManagement';
import HousekeepersManager from '@/components/housekeeping/HousekeepersManager';
import PageHeader from '@/components/housekeeping/PageHeader';
import PaymentsReport from '@/components/housekeeping/PaymentsReport';
import { useAuth } from '@/hooks/useAuth';
import { useRooms } from '@/hooks/useRooms';
import { useHousekeepers } from '@/hooks/useHousekeepers';
import { useHistory } from '@/hooks/useHistory';

const HousekeepingTable = () => {
  const {
    user,
    users,
    loginError,
    handleLogin,
    handleAddUser,
    handleDeleteUser,
    handleUpdateUser,
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
  } = useRooms();

  const {
    housekeepers,
    newHousekeeperName,
    setNewHousekeeperName,
    addHousekeeper,
    deleteHousekeeper,
  } = useHousekeepers(rooms, setRooms);

  const {
    history,
    saveToHistory,
    loadFromHistory,
    deleteFromHistory,
  } = useHistory(rooms, setRooms);

  const [filter, setFilter] = useState<'all' | 'clean' | 'dirty' | 'in-progress' | 'inspection'>('all');
  const [selectedHousekeeper, setSelectedHousekeeper] = useState<string>('all');
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [isManagingHousekeepers, setIsManagingHousekeepers] = useState(false);
  const [showPaymentsReport, setShowPaymentsReport] = useState(false);

  const filteredRooms = rooms.filter(room => {
    const statusMatch = filter === 'all' || room.status === filter;
    const housekeeperMatch = selectedHousekeeper === 'all' || room.assignedTo === selectedHousekeeper;
    return statusMatch && housekeeperMatch;
  });

  const stats = {
    total: rooms.length,
    clean: rooms.filter(r => r.status === 'clean').length,
    dirty: rooms.filter(r => r.status === 'dirty').length,
    inProgress: rooms.filter(r => r.status === 'in-progress').length,
    inspection: rooms.filter(r => r.status === 'inspection').length
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} error={loginError} />;
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <PageHeader user={user} isAdmin={isAdmin} onLogout={handleLogout} />

        <StatsCards stats={stats} />

        {isAdmin && (
          <>
            <UserManagement
              users={users}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
              onUpdateUser={handleUpdateUser}
            />

            <div className="mb-6 flex gap-3 flex-wrap">
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
          onUpdateStatus={updateRoomStatus}
          onAssignHousekeeper={assignHousekeeper}
          onStartEdit={isAdmin ? startEditRoom : () => {}}
          onSaveEdit={saveEditRoom}
          onUpdateField={updateRoomField}
          onDelete={isAdmin ? deleteRoom : () => {}}
          isAdmin={isAdmin}
        />

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
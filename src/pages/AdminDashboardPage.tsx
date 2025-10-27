import GuestDialog from '@/components/admin-guests/GuestDialog';
import OwnerCommissionManager from '@/components/admin-owners/OwnerCommissionManager';
import AdminDashboardHeader from '@/components/admin-guests/AdminDashboardHeader';
import MobileMenu from '@/components/admin-guests/MobileMenu';
import GuestsStatsGrid from '@/components/admin-guests/GuestsStatsGrid';
import GuestsToolbar from '@/components/admin-guests/GuestsToolbar';
import GuestsList from '@/components/admin-guests/GuestsList';
import GuestsDetailsPanel from '@/components/admin-guests/GuestsDetailsPanel';
import { useAdminGuests } from '@/components/admin-guests/useAdminGuests';

const AdminDashboardPage = () => {
  const {
    isAuthenticated,
    selectedGuest,
    setSelectedGuest,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    sortOrder,
    setSortOrder,
    dialogOpen,
    setDialogOpen,
    editingGuest,
    setEditingGuest,
    isRefreshing,
    showMobileDetails,
    setShowMobileDetails,
    showMobileMenu,
    setShowMobileMenu,
    activeTab,
    setActiveTab,
    filteredGuests,
    stats,
    handleLogout,
    handleRefresh,
    handleSyncBnovo,
    handleSaveGuest,
    handleDeleteGuest,
    setGuests
  } = useAdminGuests();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-30" />
      
      <AdminDashboardHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onSyncBnovo={handleSyncBnovo}
        onLogout={handleLogout}
        showMobileMenu={showMobileMenu}
        onToggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)}
      />

      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        onAddGuest={() => {
          setDialogOpen(true);
          setEditingGuest(null);
        }}
      />

      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        {activeTab === 'commission' ? (
          <OwnerCommissionManager />
        ) : (
          <>
            <GuestsStatsGrid stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <GuestsToolbar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  filter={filter}
                  onFilterChange={setFilter}
                  sortOrder={sortOrder}
                  onSortChange={setSortOrder}
                  onAddGuest={() => {
                    setDialogOpen(true);
                    setEditingGuest(null);
                  }}
                />

                <GuestsList
                  guests={filteredGuests}
                  selectedGuest={selectedGuest}
                  onSelectGuest={(guest) => {
                    setSelectedGuest(guest);
                    setShowMobileDetails(true);
                  }}
                />
              </div>

              <GuestsDetailsPanel
                selectedGuest={selectedGuest}
                showMobileDetails={showMobileDetails}
                onCloseMobileDetails={() => setShowMobileDetails(false)}
                onEdit={() => {
                  setEditingGuest(selectedGuest);
                  setDialogOpen(true);
                }}
                onDelete={handleDeleteGuest}
                onUpdate={(updatedGuest) => {
                  setGuests(prev => prev.map(g => g.id === updatedGuest.id ? updatedGuest : g));
                  setSelectedGuest(updatedGuest);
                }}
              />
            </div>

            <GuestDialog
              open={dialogOpen}
              onClose={() => {
                setDialogOpen(false);
                setEditingGuest(null);
              }}
              onSave={handleSaveGuest}
              guest={editingGuest}
            />

            <button
              onClick={() => {
                setDialogOpen(true);
                setEditingGuest(null);
              }}
              className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-lg flex items-center justify-center z-50 active:scale-95 transition-transform"
              aria-label="Добавить гостя"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
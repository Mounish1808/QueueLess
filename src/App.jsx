import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { UserDashboard } from './components/UserDashboard';
import { StaffDashboard } from './components/StaffDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CampusMap } from './components/CampusMap';
import { Analytics } from './components/Analytics';
import { Calculator } from './components/Calculator';
import { SyllabusLab } from './components/SyllabusLab';
import { PaymentDemo } from './components/PaymentDemo';
import { AuthModal } from './components/AuthModal';
import { BookingModal } from './components/BookingModal';
import { 
  getServices, 
  getCounters, 
  getBookings, 
  getUsers, 
  getCurrentUser, 
  setCurrentUser, 
  resetToDemoData,
  INITIAL_USERS 
} from './services/storage';

export function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [services, setServices] = useState(getServices);
  const [counters, setCounters] = useState(getCounters);
  const [bookings, setBookings] = useState(getBookings);
  const [users, setUsers] = useState(getUsers);
  const [currentUser, setCurrentUserState] = useState(getCurrentUser);

  // Modals & Navigation helpers
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState(null);
  const [paymentBooking, setPaymentBooking] = useState(null);

  // Notifications and floating toasts
  const [notifications, setNotifications] = useState([
    {
      title: 'Token ADM-101 is now Serving',
      message: 'Admissions Desk A called Aarav Sharma',
      time: '10:05 AM'
    },
    {
      title: 'Token LIB-302 is now Serving',
      message: 'Library Circulation Desk called Ritu Singh',
      time: '10:55 AM'
    }
  ]);
  const [toasts, setToasts] = useState([]);

  // Sync state on localStorage change
  const reloadAllData = useCallback(() => {
    setServices(getServices());
    setCounters(getCounters());
    setBookings(getBookings());
    setUsers(getUsers());
    setCurrentUserState(getCurrentUser());
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      reloadAllData();
    };

    window.addEventListener('queueless_storage_change', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('queueless_storage_change', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [reloadAllData]);

  const addToast = (toast) => {
    const id = Date.now();
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleNotify = (notif) => {
    setNotifications(prev => [notif, ...prev.slice(0, 7)]);
    addToast({
      type: 'info',
      title: notif.title,
      message: notif.message
    });
  };

  // 1-Click Role Switcher for demonstration
  const handleRoleSwitch = (targetRole) => {
    let targetUser = INITIAL_USERS[0];
    if (targetRole === 'staff') targetUser = INITIAL_USERS[1];
    if (targetRole === 'admin') targetUser = INITIAL_USERS[2];

    setCurrentUser(targetUser);
    setCurrentUserState(targetUser);

    addToast({
      type: 'success',
      title: 'Role Switched',
      message: `Active persona: ${targetUser.name} (${targetRole.toUpperCase()})`
    });

    if (targetRole === 'staff') {
      setCurrentTab('staff-desk');
    } else if (targetRole === 'admin') {
      setCurrentTab('admin');
    } else {
      setCurrentTab('my-queue');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been logged out of your account.'
    });
    setCurrentTab('home');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all queue tokens, counters, and appointments back to demo seed?')) {
      resetToDemoData();
      reloadAllData();
      addToast({
        type: 'warning',
        title: 'Demo Data Reset',
        message: 'All queues and records restored to default demonstration state.'
      });
    }
  };

  const handleBookServiceFromMap = (serviceId) => {
    setPreselectedServiceId(serviceId);
    setIsBookingOpen(true);
  };

  const handleNavigatePayment = (booking) => {
    setPaymentBooking(booking);
    setCurrentTab('payment');
  };

  return (
    <div className="app-container">
      {/* Top Navbar with quick role pills & notification bell */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentUser={currentUser}
        onRoleSwitch={handleRoleSwitch}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenBooking={() => {
          setPreselectedServiceId(null);
          setIsBookingOpen(true);
        }}
        onLogout={handleLogout}
        onResetData={handleResetData}
        notifications={notifications}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {currentTab === 'home' && (
          <Home
            services={services}
            counters={counters}
            bookings={bookings}
            onOpenBooking={() => setIsBookingOpen(true)}
            onSelectTab={setCurrentTab}
            onServiceSelect={(id) => setPreselectedServiceId(id)}
          />
        )}

        {currentTab === 'my-queue' && (
          <UserDashboard
            currentUser={currentUser}
            bookings={bookings}
            services={services}
            onOpenBooking={() => setIsBookingOpen(true)}
            onNavigatePayment={handleNavigatePayment}
            onUserUpdated={(u) => setCurrentUserState(u)}
          />
        )}

        {currentTab === 'staff-desk' && (
          <StaffDashboard
            counters={counters}
            services={services}
            bookings={bookings}
            currentUser={currentUser}
            onNotify={handleNotify}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            services={services}
            counters={counters}
            bookings={bookings}
            users={users}
            onResetData={handleResetData}
          />
        )}

        {currentTab === 'campus-map' && (
          <CampusMap
            services={services}
            bookings={bookings}
            onBookService={handleBookServiceFromMap}
          />
        )}

        {currentTab === 'analytics' && (
          <Analytics
            bookings={bookings}
            services={services}
            counters={counters}
          />
        )}

        {currentTab === 'calculator' && (
          <Calculator />
        )}

        {currentTab === 'syllabus-lab' && (
          <SyllabusLab />
        )}

        {currentTab === 'payment' && (
          <PaymentDemo
            booking={paymentBooking}
            onPaymentCompleted={(receipt) => {
              addToast({
                type: 'success',
                title: 'Fee Verified',
                message: `Payment reference ${receipt.txnId} linked to token ${receipt.tokenNumber}.`
              });
            }}
            onCancel={() => setCurrentTab('my-queue')}
          />
        )}
      </main>

      {/* Semantic Footer */}
      <Footer
        onResetData={handleResetData}
        onSelectTab={setCurrentTab}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={(user) => {
          setCurrentUserState(user);
          addToast({
            type: 'success',
            title: 'Authentication Successful',
            message: `Welcome, ${user.name}!`
          });
        }}
      />

      {/* Booking Wizard Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialServiceId={preselectedServiceId}
        currentUser={currentUser}
        onBookingCreated={(newBooking) => {
          addToast({
            type: 'success',
            title: 'Queue Token Booked!',
            message: `Your token ${newBooking.tokenNumber} is ready (#${newBooking.queuePosition} in line).`
          });
        }}
        onNavigatePayment={handleNavigatePayment}
      />

      {/* Toast Notification Container */}
      <div className="toast-container no-print">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{t.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

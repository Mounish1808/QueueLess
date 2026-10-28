import { INITIAL_SERVICES, INITIAL_COUNTERS, INITIAL_USERS, INITIAL_BOOKINGS } from '../data/seedData';

export { INITIAL_SERVICES, INITIAL_COUNTERS, INITIAL_USERS, INITIAL_BOOKINGS };

const STORAGE_KEYS = {
  SERVICES: 'queueless_services',
  COUNTERS: 'queueless_counters',
  USERS: 'queueless_users',
  BOOKINGS: 'queueless_bookings',
  CURRENT_USER: 'queueless_current_user'
};

const notifyChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('queueless_storage_change'));
  }
};

// Safe JSON Parse helper
const getFromStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
};

// Safe JSON Save helper
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    notifyChange();
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
};

// Auto-seed storage on first load
export const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    saveToStorage(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.COUNTERS)) {
    saveToStorage(STORAGE_KEYS.COUNTERS, INITIAL_COUNTERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    saveToStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    saveToStorage(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    // Default to the student user for initial preview
    saveToStorage(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  }
};

// Reset to clean seed data
export const resetToDemoData = () => {
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
  localStorage.setItem(STORAGE_KEYS.COUNTERS, JSON.stringify(INITIAL_COUNTERS));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
  notifyChange();
  return true;
};

// Services API
export const getServices = () => getFromStorage(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);

export const saveService = (service) => {
  const services = getServices();
  const index = services.findIndex(s => s.id === service.id);
  if (index >= 0) {
    services[index] = service;
  } else {
    services.push(service);
  }
  saveToStorage(STORAGE_KEYS.SERVICES, services);
  return service;
};

export const deleteService = (serviceId) => {
  const services = getServices().filter(s => s.id !== serviceId);
  saveToStorage(STORAGE_KEYS.SERVICES, services);
};

// Counters API
export const getCounters = () => getFromStorage(STORAGE_KEYS.COUNTERS, INITIAL_COUNTERS);

export const updateCounter = (counter) => {
  const counters = getCounters();
  const index = counters.findIndex(c => c.id === counter.id);
  if (index >= 0) {
    counters[index] = counter;
  } else {
    counters.push(counter);
  }
  saveToStorage(STORAGE_KEYS.COUNTERS, counters);
  return counter;
};

export const setCounterStatus = (counterId, status, servingTokenId = null) => {
  const counters = getCounters().map(c => {
    if (c.id === counterId) {
      return { ...c, status, servingTokenId };
    }
    return c;
  });
  saveToStorage(STORAGE_KEYS.COUNTERS, counters);
};

// Users API
export const getUsers = () => getFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);

export const getCurrentUser = () => getFromStorage(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);

export const setCurrentUser = (user) => {
  saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
};

export const registerUser = (userData) => {
  const users = getUsers();
  const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
  if (existing) {
    throw new Error('A user with this email address already exists.');
  }
  const newUser = {
    ...userData,
    id: `u-${Date.now()}`,
    role: userData.role || 'customer'
  };
  users.push(newUser);
  saveToStorage(STORAGE_KEYS.USERS, users);
  setCurrentUser(newUser);
  return newUser;
};

export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error('Invalid email or password.');
  }
  if (user.password !== password) {
    throw new Error('Invalid email or password.');
  }
  setCurrentUser(user);
  return user;
};

export const updateUserProfile = (userId, updates) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index >= 0) {
    users[index] = { ...users[index], ...updates };
    saveToStorage(STORAGE_KEYS.USERS, users);
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(users[index]);
    }
    return users[index];
  }
  throw new Error('User not found.');
};

// Bookings & Queue API
export const getBookings = () => getFromStorage(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);

// Generate next token number (e.g., ADM-103)
export const generateTokenNumber = (serviceCode) => {
  const bookings = getBookings();
  const prefix = serviceCode || 'TKN';
  const matching = bookings
    .filter(b => b.tokenNumber && b.tokenNumber.startsWith(prefix))
    .map(b => {
      const parts = b.tokenNumber.split('-');
      return parts[1] ? parseInt(parts[1], 10) : 0;
    })
    .filter(n => !isNaN(n));

  const maxNum = matching.length > 0 ? Math.max(...matching) : 100;
  return `${prefix}-${maxNum + 1}`;
};

export const createBooking = (bookingData) => {
  const bookings = getBookings();
  const services = getServices();
  const service = services.find(s => s.id === bookingData.serviceId);

  // Check duplicate booking for same user, service, and date
  const isDuplicate = bookings.some(b => 
    b.userId === bookingData.userId &&
    b.serviceId === bookingData.serviceId &&
    b.date === bookingData.date &&
    (b.status === 'waiting' || b.status === 'serving' || b.status === 'called')
  );

  if (isDuplicate) {
    throw new Error('You already have an active queue booking for this service on the selected date.');
  }

  // Count existing waiting people for this service to calculate queue position
  const waitingCount = bookings.filter(b => 
    b.serviceId === bookingData.serviceId && 
    b.date === bookingData.date && 
    b.status === 'waiting'
  ).length;

  const tokenNumber = generateTokenNumber(service ? service.code : 'TKN');
  const now = new Date();
  const avgWait = service ? service.avgWaitMins : 10;

  const newBooking = {
    id: `T-${Date.now()}`,
    tokenNumber,
    serviceId: bookingData.serviceId,
    serviceName: service ? service.name : 'General Service',
    counterId: service && service.counters && service.counters[0] ? service.counters[0] : 'C1',
    userId: bookingData.userId,
    userName: bookingData.userName,
    userEmail: bookingData.userEmail,
    userPhone: bookingData.userPhone,
    date: bookingData.date,
    slotTime: bookingData.slotTime,
    status: 'waiting',
    queuePosition: waitingCount + 1,
    estimatedWaitMins: (waitingCount + 1) * avgWait,
    notes: bookingData.notes || '',
    createdAt: now.toISOString(),
    isPaid: Boolean(bookingData.isPaid),
    paymentRef: bookingData.paymentRef || null
  };

  bookings.push(newBooking);
  saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
  return newBooking;
};

export const updateBookingStatus = (bookingId, newStatus, extra = {}) => {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index >= 0) {
    const booking = bookings[index];
    const updated = { ...booking, status: newStatus, ...extra };
    
    if (newStatus === 'called') {
      updated.calledAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (newStatus === 'completed') {
      updated.completedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    bookings[index] = updated;

    // Recalculate queue positions for other waiting bookings of this service
    recalcQueuePositions(bookings, booking.serviceId, booking.date);

    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
    return updated;
  }
  throw new Error('Booking not found.');
};

// Internal helper to update queue positions
const recalcQueuePositions = (bookings, serviceId, date) => {
  let pos = 1;
  bookings.forEach(b => {
    if (b.serviceId === serviceId && b.date === date && b.status === 'waiting') {
      b.queuePosition = pos++;
    }
  });
};

export const cancelBooking = (bookingId, reason = 'Cancelled by user') => {
  return updateBookingStatus(bookingId, 'cancelled', { cancellationReason: reason });
};

export const rescheduleBooking = (bookingId, newDate, newSlotTime) => {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index >= 0) {
    bookings[index].date = newDate;
    bookings[index].slotTime = newSlotTime;
    bookings[index].status = 'waiting';
    bookings[index].rescheduledAt = new Date().toISOString();
    recalcQueuePositions(bookings, bookings[index].serviceId, newDate);
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
    return bookings[index];
  }
  throw new Error('Booking not found.');
};

// Auto initialize on module load
initStorage();

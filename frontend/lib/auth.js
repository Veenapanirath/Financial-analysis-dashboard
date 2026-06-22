// ============================================
// TOKEN MANAGEMENT
// ============================================
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

// ============================================
// USER STATE MANAGEMENT
// ============================================
export const getUser = () => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
  return null;
};

export const setUser = (user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const removeUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

// ============================================
// AUTHENTICATION CHECKS
// ============================================
export const isAuthenticated = () => {
  return !!getToken();
};

export const isTokenExpired = (token) => {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// ============================================
// LOGOUT
// ============================================
export const logout = () => {
  removeToken();
  removeUser();
};

// ============================================
// ROLE CHECKING
// ============================================
export const hasRole = (roles) => {
  const user = getUser();
  if (!user) return false;
  if (typeof roles === 'string') {
    return user.role === roles;
  }
  return roles.includes(user.role);
};

/**
 * Production-ready API client for interacting with the backend server
 */

// API base URL - can be configured via environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

/**
 * Helper function to handle API requests
 * @param {string} endpoint - API endpoint to call (without the base URL)
 * @param {Object} options - Fetch API options
 * @returns {Promise<any>} - JSON response from the API
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
    console.log(`Making API request to: ${url}`);
    
    // Set default headers if not provided
    const headers = options.headers || {};
    if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    
    // Merge options with defaults
    const requestOptions = {
      ...options,
      headers,
    };
    
    // Convert body to JSON string if it's an object and not FormData
    if (requestOptions.body && 
        typeof requestOptions.body === 'object' && 
        !(requestOptions.body instanceof FormData)) {
      requestOptions.body = JSON.stringify(requestOptions.body);
    }
    
    console.log('Request options:', {
      method: requestOptions.method || 'GET',
      headers: requestOptions.headers,
      bodyLength: requestOptions.body ? 'Present' : 'None'
    });
    
    const response = await fetch(url, requestOptions);
    
    // Handle HTTP errors
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      console.error(`Request URL: ${url}`);
      console.error(`Method: ${requestOptions.method || 'GET'}`);
      
      let errorMessage;
      try {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        errorMessage = errorData.error || `HTTP error ${response.status}`;
      } catch (parseError) {
        console.error('Could not parse error response:', parseError);
        errorMessage = `HTTP error ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    throw error;
  }
}

// ======= Booking Endpoints =======

/**
 * Create a new booking
 * @param {Object} bookingData - The booking data from the form
 * @returns {Promise<{message: string, booking: Object}>}
 */
export const createBooking = async (bookingData) => {
  return apiRequest('/book', {
    method: 'POST',
    body: bookingData,
  });
};

/**
 * Get booking details by ID or phone number
 * @param {Object} params - Query parameters
 * @param {string} [params.bookingId] - The booking ID
 * @param {string} [params.contactNumber] - The contact number
 * @returns {Promise<{booking: Object} | {bookings: Object[]}>}
 */
export const getBooking = async ({ bookingId, contactNumber }) => {
  const params = new URLSearchParams();
  
  if (bookingId) {
    params.append('booking_id', bookingId);
  } else if (contactNumber) {
    params.append('contact_number', contactNumber);
  }
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/booking${queryString}`);
};

/**
 * Get all bookings
 * @returns {Promise<{bookings: Object[]}>}
 */
export const getBookings = async () => {
  return apiRequest('/bookings');
};

/**
 * Delete a specific booking by ID
 * @param {string} bookingId - The ID of the booking to delete
 * @returns {Promise<{message: string, id: string}>}
 */
export const deleteBooking = async (bookingId) => {
  // Add debugging
  console.log(`Attempting to delete booking with ID: ${bookingId}`);
  console.log(`Request URL: ${API_URL}/bookings/${encodeURIComponent(bookingId)}`);
  
  try {
    return await apiRequest(`/bookings/${encodeURIComponent(bookingId)}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(`Delete booking error for ID ${bookingId}:`, error);
    throw error;
  }
};

/**
 * Delete all past bookings (events that have already occurred)
 * @returns {Promise<{message: string, deleted_count: number}>}
 */
export const deletePastBookings = async () => {
  return apiRequest('/bookings/past', {
    method: 'DELETE',
  });
};

// ======= Admin Endpoints =======

/**
 * Admin login
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.username - Admin username
 * @param {string} credentials.password - Admin password
 * @returns {Promise<{admin: Object}>}
 */
export const adminLogin = async (credentials) => {
  return apiRequest('/signin', {
    method: 'POST',
    body: credentials,
  });
};

/**
 * Update admin settings or create new admin
 * @param {Object} adminData - Admin data
 * @param {string} [token] - Authentication token (if needed)
 * @returns {Promise<{message: string}>}
 */
export const updateAdmin = async (adminData, token) => {
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  
  return apiRequest('/admin', {
    method: 'POST',
    headers,
    body: adminData,
  });
};

// ======= Employee Endpoints =======

/**
 * Get all employees
 * @param {string} [token] - Authentication token (if needed)
 * @returns {Promise<{employees: Object[]}>}
 */
export const getEmployees = async (token) => {
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  
  return apiRequest('/employees', {
    headers,
  });
};

/**
 * Get detailed information about a specific employee
 * @param {string} username - Employee username
 * @param {string} [token] - Authentication token (optional)
 * @returns {Promise<{employee: Object}>}
 */
export const getEmployeeDetails = async (username, token) => {
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  
  return apiRequest(`/employees/${username}`, {
    headers,
  });
};

/**
 * Create or update an employee
 * @param {Object} employeeData - Employee data
 * @param {string} [token] - Authentication token (if needed)
 * @returns {Promise<{message: string, employee: Object}>}
 */
export const saveEmployee = async (employeeData, token) => {
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  
  return apiRequest('/employees', {
    method: 'POST',
    headers,
    body: employeeData,
  });
};

/**
 * Delete an employee
 * @param {string} username - Employee username
 * @param {string} [token] - Authentication token (if needed)
 * @returns {Promise<{message: string}>}
 */
export const deleteEmployee = async (username, token) => {
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  
  return apiRequest(`/employees/${username}`, {
    method: 'DELETE',
    headers,
  });
};

/**
 * Add a payment to an employee
 * @param {string} username - Employee username
 * @param {Object} paymentData - Payment data
 * @param {number} paymentData.amountPaid - Amount paid
 * @param {string} paymentData.date - Payment date in YYYY-MM-DD format
 * @param {string} [token] - Authentication token (if needed)
 * @returns {Promise<{message: string, payment: Object}>}
 */
export const addPayment = async (username, paymentData, token) => {
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  
  return apiRequest(`/employees/${username}/payments`, {
    method: 'POST',
    headers,
    body: paymentData,
  });
};

/**
 * Delete a payment for an employee
 * @param {string} username - Employee username
 * @param {string|number} paymentId - Payment ID
 * @param {string} [token] - Authentication token (if needed)
 * @returns {Promise<{message: string}>}
 */
export const deletePayment = async (username, paymentId, token) => {
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  
  return apiRequest(`/employees/${username}/payments/${paymentId}`, {
    method: 'DELETE',
    headers,
  });
};

// Export a default API object that includes all endpoints
export default {
  createBooking,
  getBooking,
  getBookings,
  adminLogin,
  updateAdmin,
  getEmployees,
  getEmployeeDetails,
  saveEmployee,
  deleteEmployee,
  addPayment,
  deletePayment,
  deleteBooking,
  deletePastBookings,
}; 
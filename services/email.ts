
/**
 * EMAIL SERVICE (Powered by Google Apps Script)
 */

// PASTE YOUR GOOGLE WEB APP URL HERE
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxvAxOaKYG02mVzYsgZNMD4TSg3p8AdHeoPduifMMTRb2vZr6W7jyWBYOX40UDmvQLw/exec';

export const emailService = {
  /**
   * Scenario 1 & 2: Notify both User and Admin of a new booking
   */
  sendNewBookingNotification: async (appointmentData: any) => {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('YOUR_GOOGLE')) {
      console.warn('Email service: Google Script URL not set.');
      return { success: false };
    }

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'NEW_BOOKING',
          payload: appointmentData
        }),
      });
      return { success: true };
    } catch (error) {
      console.error('GAS Email Error:', error);
      return { success: false };
    }
  },

  /**
   * Scenario 3: Notify User when status is updated by Doctor
   */
  sendAppointmentStatusUpdate: async (appointmentData: any, status: 'confirmed' | 'cancelled') => {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('YOUR_GOOGLE')) return { success: false };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'STATUS_UPDATE',
          payload: { ...appointmentData, status }
        }),
      });
      return { success: true };
    } catch (error) {
      console.error('GAS Email Error:', error);
      return { success: false };
    }
  }
};

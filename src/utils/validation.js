// Form Validation Utilities for QueueLess
// Demonstrates Client-Side JavaScript Regular Expressions & Field Validation

export const REGEX_PATTERNS = {
  // Letters and spaces only, 3 to 50 characters
  NAME: /^[a-zA-Z\s.]{3,50}$/,
  // Standard RFC-compliant email pattern
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // 10-digit Indian mobile number starting with 6, 7, 8, or 9
  PHONE: /^[6-9]\d{9}$/,
  // 6-digit postal PIN code
  PIN_CODE: /^\d{6}$/,
  // Minimum 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^_-])[A-Za-z\d@$!%*?&#^_-]{8,}$/,
  // Card number: 16 digits
  CARD_NUMBER: /^\d{16}$/,
  // Expiry date format: MM/YY
  EXPIRY: /^(0[1-9]|1[0-2])\/\d{2}$/,
  // CVV: 3 digits
  CVV: /^\d{3}$/,
  // UPI ID: username@bank
  UPI_ID: /^[\w.-]{3,30}@[a-zA-Z]{2,15}$/
};

// Luhn Algorithm implementation for Credit/Debit Card validation
export const luhnCheck = (val) => {
  const sanitized = String(val).replace(/[\s-]/g, '');
  if (!/^\d{13,19}$/.test(sanitized)) return false;

  let sum = 0;
  let shouldDouble = false;
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

// Validate Registration Form
export const validateRegistration = (formData) => {
  const errors = {};

  // Full Name
  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Full name is required.';
  } else if (!REGEX_PATTERNS.NAME.test(formData.name.trim())) {
    errors.name = 'Name must be 3-50 letters without special characters or numbers.';
  }

  // Email Address
  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!REGEX_PATTERNS.EMAIL.test(formData.email.trim())) {
    errors.email = 'Please enter a valid email address (e.g., student@college.edu).';
  }

  // Phone Number
  if (!formData.phone || !formData.phone.trim()) {
    errors.phone = 'Mobile number is required.';
  } else if (!REGEX_PATTERNS.PHONE.test(formData.phone.trim().replace(/\D/g, ''))) {
    errors.phone = 'Enter a valid 10-digit mobile number starting with 6-9.';
  }

  // Date of Birth
  if (!formData.dob) {
    errors.dob = 'Date of birth is required.';
  } else {
    const dobDate = new Date(formData.dob);
    const today = new Date();
    if (isNaN(dobDate.getTime())) {
      errors.dob = 'Please select a valid date.';
    } else if (dobDate >= today) {
      errors.dob = 'Date of birth cannot be today or in the future.';
    } else {
      const ageDiff = today.getFullYear() - dobDate.getFullYear();
      if (ageDiff < 15 || ageDiff > 100) {
        errors.dob = 'Applicant age must be at least 15 years.';
      }
    }
  }

  // PIN Code
  if (!formData.pinCode || !formData.pinCode.trim()) {
    errors.pinCode = 'Postal PIN code is required.';
  } else if (!REGEX_PATTERNS.PIN_CODE.test(formData.pinCode.trim())) {
    errors.pinCode = 'PIN code must be exactly 6 digits (e.g., 560001).';
  }

  // Password
  if (!formData.password) {
    errors.password = 'Password is required.';
  } else if (!REGEX_PATTERNS.PASSWORD_STRONG.test(formData.password)) {
    errors.password = 'Password must have at least 8 chars, 1 uppercase, 1 lowercase, 1 digit, and 1 special symbol.';
  }

  // Confirm Password
  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Confirm your password.';
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate Login Form
export const validateLogin = (formData) => {
  const errors = {};
  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!REGEX_PATTERNS.EMAIL.test(formData.email.trim())) {
    errors.email = 'Invalid email address format.';
  }

  if (!formData.password) {
    errors.password = 'Password is required.';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate Payment Form
export const validatePayment = (formData, method = 'card') => {
  const errors = {};

  if (method === 'card') {
    // Cardholder Name
    if (!formData.cardHolder || !formData.cardHolder.trim()) {
      errors.cardHolder = 'Cardholder name is required.';
    } else if (!REGEX_PATTERNS.NAME.test(formData.cardHolder.trim())) {
      errors.cardHolder = 'Enter full name as printed on card.';
    }

    // Card Number
    const rawCard = (formData.cardNumber || '').replace(/[\s-]/g, '');
    if (!rawCard) {
      errors.cardNumber = 'Card number is required.';
    } else if (!/^\d{16}$/.test(rawCard)) {
      errors.cardNumber = 'Card number must be 16 digits.';
    } else if (!luhnCheck(rawCard)) {
      errors.cardNumber = 'Invalid card number checksum (Luhn check failed).';
    }

    // Expiry
    if (!formData.expiry || !formData.expiry.trim()) {
      errors.expiry = 'Expiration date (MM/YY) is required.';
    } else if (!REGEX_PATTERNS.EXPIRY.test(formData.expiry.trim())) {
      errors.expiry = 'Format must be MM/YY (e.g., 08/28).';
    } else {
      const [mm, yy] = formData.expiry.trim().split('/').map(n => parseInt(n, 10));
      const now = new Date();
      const currentYear = parseInt(now.getFullYear().toString().slice(-2), 10);
      const currentMonth = now.getMonth() + 1;
      if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
        errors.expiry = 'Card has already expired.';
      }
    }

    // CVV
    if (!formData.cvv || !formData.cvv.trim()) {
      errors.cvv = 'CVV code is required.';
    } else if (!REGEX_PATTERNS.CVV.test(formData.cvv.trim())) {
      errors.cvv = 'CVV must be 3 digits.';
    }
  } else if (method === 'upi') {
    if (!formData.upiId || !formData.upiId.trim()) {
      errors.upiId = 'Virtual Payment Address (UPI ID) is required.';
    } else if (!REGEX_PATTERNS.UPI_ID.test(formData.upiId.trim())) {
      errors.upiId = 'Enter a valid UPI ID (e.g., student@okaxis or name@upi).';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

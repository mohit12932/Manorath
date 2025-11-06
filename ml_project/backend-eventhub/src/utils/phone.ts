import { parsePhoneNumber } from 'libphonenumber-js';

/**
 * Normalize phone number using libphonenumber-js
 * Removes all formatting and returns just the national number
 */
export const normalizePhoneNumber = (
  countryCode: string,
  mobile: string
): { countryCode: string; mobile: string; isValid: boolean } => {
  try {
    // Remove any non-digit characters from mobile
    const cleanMobile = mobile.replace(/\D/g, '');

    // Ensure country code starts with +
    const formattedCountryCode = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;

    // Parse the phone number
    const phoneNumber = parsePhoneNumber(`${formattedCountryCode}${cleanMobile}`);

    if (!phoneNumber) {
      return {
        countryCode: formattedCountryCode,
        mobile: cleanMobile,
        isValid: false,
      };
    }

    return {
      countryCode: `+${phoneNumber.countryCallingCode}`,
      mobile: phoneNumber.nationalNumber,
      isValid: phoneNumber.isValid(),
    };
  } catch (error) {
    // If parsing fails, return cleaned input as-is with invalid flag
    return {
      countryCode: countryCode.startsWith('+') ? countryCode : `+${countryCode}`,
      mobile: mobile.replace(/\D/g, ''),
      isValid: false,
    };
  }
};

/**
 * Validate phone number
 */
export const isValidPhoneNumber = (countryCode: string, mobile: string): boolean => {
  const normalized = normalizePhoneNumber(countryCode, mobile);
  return normalized.isValid;
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (
  countryCode: string,
  mobile: string,
  format: 'NATIONAL' | 'INTERNATIONAL' = 'INTERNATIONAL'
): string => {
  try {
    const formattedCountryCode = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;
    const phoneNumber = parsePhoneNumber(`${formattedCountryCode}${mobile}`);

    if (!phoneNumber) {
      return `${countryCode} ${mobile}`;
    }

    return phoneNumber.format(format);
  } catch (error) {
    return `${countryCode} ${mobile}`;
  }
};

/**
 * Get country code from phone number
 */
export const getCountryCodeFromNumber = (phoneNumber: string): string | null => {
  try {
    const parsed = parsePhoneNumber(phoneNumber);
    if (!parsed) return null;
    return `+${parsed.countryCallingCode}`;
  } catch {
    return null;
  }
};

/**
 * Validates if a phone number is a valid Ethiopian format.
 * Supported formats:
 * - 09... (10 digits)
 * - 07... (10 digits)
 * - +2519... (13 digits)
 * - +2517... (13 digits)
 * - 2519... (12 digits)
 * - 2517... (12 digits)
 */
export const isValidEthiopianPhoneNumber = (phoneNumber: string): boolean => {
    // Remove all non-digit characters except the leading '+'
    const cleaned = phoneNumber.replace(/[^\d+]/g, "");

    // Regular expression for Ethiopian phone numbers
    // Matches:
    // 1. 09 followed by 8 digits or 07 followed by 8 digits
    // 2. +2519 followed by 8 digits or +2517 followed by 8 digits
    // 3. 2519 followed by 8 digits or 2517 followed by 8 digits
    const ethioRegex = /^(09|07)\d{8}$|^\+251(9|7)\d{8}$|^251(9|7)\d{8}$/;

    return ethioRegex.test(cleaned);
};

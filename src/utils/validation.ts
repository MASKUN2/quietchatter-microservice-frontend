import { VALIDATION, MESSAGES } from '../constants';

/**
 * Validates a nickname based on the defined rules:
 * - Length: between 1 and 12 characters.
 * - Content: No special characters (only letters, numbers, and Korean characters allowed).
 */
export const validateNickname = (nickname: string): { isValid: boolean; message?: string } => {
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
        return { isValid: false, message: MESSAGES.ERROR.NICKNAME_REQUIRED };
    }

    if (
        trimmedNickname.length < VALIDATION.NICKNAME_MIN_LENGTH ||
        trimmedNickname.length > VALIDATION.NICKNAME_MAX_LENGTH
    ) {
        return { isValid: false, message: MESSAGES.ERROR.NICKNAME_LENGTH };
    }

    if (!VALIDATION.NICKNAME_REGEX.test(trimmedNickname)) {
        return { isValid: false, message: MESSAGES.ERROR.NICKNAME_SPECIAL_CHARS };
    }

    return { isValid: true };
};

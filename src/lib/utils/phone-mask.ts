import {
  COUNTRY_PHONE_RULES,
  DEFAULT_PHONE_RULE,
} from '../data/phone-data';
import type { CountryPhoneRule } from '../types/country.types';

/**
 * Strips all non-digit characters from a phone number string.
 */
export function cleanDigits(value?: string | null): string {
  if (!value) return '';
  return value.replace(/\D/g, '');
}

/**
 * Formats a sequence of digits according to a mask pattern where '#' represents a digit.
 * Separators before unconsumed digits are automatically included.
 * Trailing separators are omitted if no subsequent digits are present.
 */
export function formatWithMask(digits: string, mask: string): string {
  if (!digits || !mask) return digits;

  let formatted = '';
  let digitIndex = 0;

  for (let i = 0; i < mask.length && digitIndex < digits.length; i++) {
    const maskChar = mask[i];
    if (maskChar === '#') {
      formatted += digits[digitIndex];
      digitIndex++;
    } else {
      formatted += maskChar;
    }
  }

  return formatted;
}

/**
 * Applies cleaning, digit truncating (maxDigits), and optional mask formatting.
 */
export function applyPhoneMask(
  value: string,
  mask?: string,
  maxDigits?: number
): string {
  let digits = cleanDigits(value);

  if (typeof maxDigits === 'number' && maxDigits > 0) {
    digits = digits.slice(0, maxDigits);
  }

  if (!mask) {
    return digits;
  }

  return formatWithMask(digits, mask);
}

/**
 * Retrieves the CountryPhoneRule for a given ISO 3166-1 alpha-2 country code.
 */
export function getCountryPhoneRule(isoCode?: string | null): CountryPhoneRule {
  if (!isoCode) return DEFAULT_PHONE_RULE;
  const upper = isoCode.trim().toUpperCase();
  return COUNTRY_PHONE_RULES[upper] ?? DEFAULT_PHONE_RULE;
}

/**
 * Calculates the maximum text character length for an input when a mask is used.
 */
export function getMaskMaxLength(
  mask?: string,
  maxDigits?: number
): number | undefined {
  if (mask && mask.includes('#')) {
    return mask.length;
  }
  if (typeof maxDigits === 'number' && maxDigits > 0) {
    return maxDigits;
  }
  return undefined;
}

/**
 * Normalizes text for search comparisons (lowercase, removes diacritics/accents).
 */
export function normalizeText(text?: string | null): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Converts ISO 3166-1 alpha-2 code to emoji flag (e.g. "GT" -> 🇬🇹).
 */
export function getCountryEmoji(isoCode?: string | null): string {
  if (!isoCode || isoCode.length !== 2) return '🌐';
  const codePoints = [...isoCode.toUpperCase()].map(
    (c) => 127397 + c.charCodeAt(0)
  );
  return String.fromCodePoint(...codePoints);
}

/**
 * Generates flag image URL using flagcdn or custom base URL.
 */
export function getFlagUrl(
  isoCode?: string | null,
  baseUrl = 'https://flagcdn.com/w40/'
): string {
  if (!isoCode) return '';
  return `${baseUrl}${isoCode.toLowerCase()}.png`;
}


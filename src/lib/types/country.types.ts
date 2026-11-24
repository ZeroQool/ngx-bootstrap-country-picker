/**
 * Controls what is displayed in the input field after a country is selected.
 */
export type CountryDisplayMode = 'name' | 'dialCode' | 'currency';

/**
 * Visual mode of the country picker input.
 * - 'outlined': standard Bootstrap input with full border (default)
 * - 'flat': border-bottom only (underline style)
 * - 'floating': Bootstrap floating label style
 */
export type CountryInputMode = 'outlined' | 'flat' | 'floating';

/**
 * Picker presentation mode.
 * - 'dropdown': sleek Bootstrap dropdown menu positioned below the input (default)
 * - 'modal': centered backdrop dialog modal
 */
export type CountryModalMode = 'dropdown' | 'modal';

/**
 * Bootstrap sizing options.
 */
export type CountryPickerSize = 'sm' | 'md' | 'lg';

/**
 * Supported UI and translation languages.
 */
export type CountryLanguage = 'es' | 'en';

export interface Country {
  /** Country name in English (e.g. "Guatemala", "Mexico") */
  name: string;
  /** Country name in Spanish (e.g. "Guatemala", "México") */
  nameEs: string;
  /** ISO 3166-1 alpha-2 code (e.g. "GT", "MX", "US") */
  isoCode: string;
  /** International dial code (e.g. "+502", "+52", "+1") */
  dialCode: string;
  /** ISO 4217 currency code (e.g. "GTQ", "MXN", "USD") */
  currency: string;
  /** Currency symbol (e.g. "Q", "$", "€") */
  currencySymbol: string;
  /** Optional phone mask pattern (e.g. "####-####") */
  phoneMask?: string;
  /** Optional maximum allowed digits for phone number */
  maxPhoneDigits?: number;
}

export interface CountryPhoneRule {
  /** Visual mask with '#' as digit placeholders (e.g. '####-####') */
  mask: string;
  /** Maximum number of raw digits allowed for this country */
  maxDigits: number;
  /** Example placeholder formatted according to mask */
  placeholder?: string;
}

/**
 * Translations dictionary for UI strings.
 */
export interface CountryPickerTranslations {
  name: {
    label: string;
    placeholder: string;
    modal: string;
  };
  dialCode: {
    label: string;
    placeholder: string;
    modal: string;
    phonePlaceholder: string;
  };
  currency: {
    label: string;
    placeholder: string;
    modal: string;
  };
  search: string;
  noResults: string;
  select: string;
  resultsCount: (count: number) => string;
  close: string;
}

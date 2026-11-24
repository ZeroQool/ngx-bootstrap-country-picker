import type { CountryPhoneRule } from '../types/country.types';

/**
 * Standard phone rules by ISO 3166-1 alpha-2 code.
 * Covers Latin America, North America, Europe, Asia, Africa, and major global countries.
 */
export const COUNTRY_PHONE_RULES: Record<string, CountryPhoneRule> = {
  // ── Central America ──
  GT: { mask: '####-####', maxDigits: 8, placeholder: '1234-5678' },
  SV: { mask: '####-####', maxDigits: 8, placeholder: '1234-5678' },
  HN: { mask: '####-####', maxDigits: 8, placeholder: '1234-5678' },
  NI: { mask: '####-####', maxDigits: 8, placeholder: '1234-5678' },
  CR: { mask: '####-####', maxDigits: 8, placeholder: '1234-5678' },
  PA: { mask: '####-####', maxDigits: 8, placeholder: '1234-5678' },
  BZ: { mask: '###-####', maxDigits: 7, placeholder: '123-4567' },

  // ── North America ──
  US: { mask: '(###) ###-####', maxDigits: 10, placeholder: '(555) 123-4567' },
  CA: { mask: '(###) ###-####', maxDigits: 10, placeholder: '(555) 123-4567' },
  MX: { mask: '## #### ####', maxDigits: 10, placeholder: '55 1234 5678' },

  // ── Caribbean ──
  DO: { mask: '(###) ###-####', maxDigits: 10, placeholder: '(809) 123-4567' },
  PR: { mask: '(###) ###-####', maxDigits: 10, placeholder: '(787) 123-4567' },
  CU: { mask: '#### ####', maxDigits: 8, placeholder: '1234 5678' },
  JM: { mask: '(###) ###-####', maxDigits: 10, placeholder: '(876) 123-4567' },
  HT: { mask: '####-####', maxDigits: 8, placeholder: '1234-5678' },
  TT: { mask: '(###) ###-####', maxDigits: 10, placeholder: '(868) 123-4567' },
  BS: { mask: '(###) ###-####', maxDigits: 10, placeholder: '(242) 123-4567' },
  BB: { mask: '(###) ###-####', maxDigits: 10, placeholder: '(246) 123-4567' },

  // ── South America ──
  AR: { mask: '## ####-####', maxDigits: 10, placeholder: '11 1234-5678' },
  BR: {
    mask: '(##) #####-####',
    maxDigits: 11,
    placeholder: '(11) 91234-5678',
  },
  CL: { mask: '# #### ####', maxDigits: 9, placeholder: '9 1234 5678' },
  CO: { mask: '### ### ####', maxDigits: 10, placeholder: '300 123 4567' },
  PE: { mask: '### ### ###', maxDigits: 9, placeholder: '912 345 678' },
  EC: { mask: '## ### ####', maxDigits: 9, placeholder: '09 123 4567' },
  UY: { mask: '#### ####', maxDigits: 8, placeholder: '1234 5678' },
  PY: { mask: '### ### ###', maxDigits: 9, placeholder: '098 123 456' },
  BO: { mask: '#### ####', maxDigits: 8, placeholder: '1234 5678' },
  VE: { mask: '###-###-####', maxDigits: 10, placeholder: '412-123-4567' },
  GY: { mask: '###-####', maxDigits: 7, placeholder: '123-4567' },
  SR: { mask: '###-####', maxDigits: 7, placeholder: '123-4567' },

  // ── Europe ──
  ES: { mask: '### ## ## ##', maxDigits: 9, placeholder: '612 34 56 78' },
  GB: { mask: '#### ######', maxDigits: 10, placeholder: '7123 456789' },
  FR: { mask: '# ## ## ## ##', maxDigits: 9, placeholder: '6 12 34 56 78' },
  DE: { mask: '### #######', maxDigits: 11, placeholder: '151 1234567' },
  IT: { mask: '### #######', maxDigits: 10, placeholder: '312 3456789' },
  PT: { mask: '### ### ###', maxDigits: 9, placeholder: '912 345 678' },
  NL: { mask: '# ## ## ## ##', maxDigits: 9, placeholder: '6 12 34 56 78' },
  BE: { mask: '### ## ## ##', maxDigits: 9, placeholder: '470 12 34 56' },
  CH: { mask: '## ### ## ##', maxDigits: 9, placeholder: '79 123 45 67' },
  AT: { mask: '### #######', maxDigits: 10, placeholder: '664 1234567' },
  SE: { mask: '##-### ## ##', maxDigits: 9, placeholder: '70-123 45 67' },
  NO: { mask: '### ## ###', maxDigits: 8, placeholder: '412 34 567' },
  DK: { mask: '## ## ## ##', maxDigits: 8, placeholder: '12 34 56 78' },
  FI: { mask: '## ### ####', maxDigits: 9, placeholder: '40 123 4567' },
  IE: { mask: '## ### ####', maxDigits: 9, placeholder: '87 123 4567' },
  PL: { mask: '### ### ###', maxDigits: 9, placeholder: '512 345 678' },
  CZ: { mask: '### ### ###', maxDigits: 9, placeholder: '601 123 456' },
  GR: { mask: '### #######', maxDigits: 10, placeholder: '691 1234567' },
  RO: { mask: '### ### ###', maxDigits: 9, placeholder: '712 345 678' },
  UA: { mask: '## ### ####', maxDigits: 9, placeholder: '50 123 4567' },
  RU: {
    mask: '(###) ###-##-##',
    maxDigits: 10,
    placeholder: '(912) 345-67-89',
  },

  // ── Asia & Oceania ──
  CN: { mask: '### #### ####', maxDigits: 11, placeholder: '138 1234 5678' },
  JP: { mask: '##-####-####', maxDigits: 10, placeholder: '90-1234-5678' },
  KR: { mask: '##-####-####', maxDigits: 10, placeholder: '10-1234-5678' },
  IN: { mask: '##### #####', maxDigits: 10, placeholder: '98765 43210' },
  AU: { mask: '#### ### ###', maxDigits: 10, placeholder: '0412 345 678' },
  NZ: { mask: '### ### ####', maxDigits: 9, placeholder: '021 123 4567' },
  SG: { mask: '#### ####', maxDigits: 8, placeholder: '8123 4567' },
  MY: { mask: '##-### ####', maxDigits: 9, placeholder: '12-345 6789' },
  PH: { mask: '### ### ####', maxDigits: 10, placeholder: '917 123 4567' },
  ID: { mask: '###-####-####', maxDigits: 11, placeholder: '812-3456-7890' },
  TH: { mask: '## #### ####', maxDigits: 9, placeholder: '81 234 5678' },
  VN: { mask: '### ### ####', maxDigits: 9, placeholder: '912 345 678' },
  IL: { mask: '##-###-####', maxDigits: 9, placeholder: '50-123-4567' },
  AE: { mask: '## ### ####', maxDigits: 9, placeholder: '50 123 4567' },
  SA: { mask: '## ### ####', maxDigits: 9, placeholder: '50 123 4567' },
  TR: {
    mask: '(###) ### ## ##',
    maxDigits: 10,
    placeholder: '(532) 123 45 67',
  },

  // ── Africa ──
  ZA: { mask: '## ### ####', maxDigits: 9, placeholder: '82 123 4567' },
  EG: { mask: '### ### ####', maxDigits: 10, placeholder: '100 123 4567' },
  NG: { mask: '### ### ####', maxDigits: 10, placeholder: '802 123 4567' },
  KE: { mask: '### ######', maxDigits: 9, placeholder: '712 345678' },
  MA: { mask: '## ## ## ##', maxDigits: 9, placeholder: '61 23 45 67' },
};

/**
 * Fallback rule for countries without a specific entry.
 * ITU-T E.164 recommends up to 15 digits for international numbers.
 */
export const DEFAULT_PHONE_RULE: CountryPhoneRule = {
  mask: '',
  maxDigits: 15,
  placeholder: 'Número de teléfono',
};


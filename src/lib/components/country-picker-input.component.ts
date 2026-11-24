import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { COUNTRIES } from '../data/countries';
import {
  COUNTRY_PHONE_RULES,
  DEFAULT_PHONE_RULE,
} from '../data/phone-data';
import type {
  Country,
  CountryDisplayMode,
  CountryInputMode,
  CountryLanguage,
  CountryModalMode,
  CountryPickerSize,
  CountryPickerTranslations,
} from '../types/country.types';
import {
  cleanDigits,
  formatWithMask,
  getCountryEmoji,
  getCountryPhoneRule,
  getFlagUrl,
  getMaskMaxLength,
  normalizeText,
} from '../utils/phone-mask';

export const TRANSLATIONS: Record<CountryLanguage, CountryPickerTranslations> = {
  es: {
    name: {
      label: 'País',
      placeholder: 'Selecciona un país',
      modal: 'Selecciona un país',
    },
    dialCode: {
      label: 'Prefijo telefónico',
      placeholder: 'Selecciona prefijo',
      modal: 'Selecciona prefijo',
      phonePlaceholder: 'Número de teléfono',
    },
    currency: {
      label: 'Moneda',
      placeholder: 'Selecciona moneda',
      modal: 'Selecciona moneda',
    },
    search: 'Buscar por nombre, código ISO o prefijo...',
    noResults: 'No se encontraron países',
    select: 'Seleccionar',
    resultsCount: (count: number) =>
      `${count} ${count === 1 ? 'país disponible' : 'países disponibles'}`,
    close: 'Cerrar',
  },
  en: {
    name: {
      label: 'Country',
      placeholder: 'Select a country',
      modal: 'Select a country',
    },
    dialCode: {
      label: 'Phone prefix',
      placeholder: 'Select prefix',
      modal: 'Select prefix',
      phonePlaceholder: 'Phone number',
    },
    currency: {
      label: 'Currency',
      placeholder: 'Select currency',
      modal: 'Select currency',
    },
    search: 'Search by name, ISO code or dial code...',
    noResults: 'No countries found',
    select: 'Select',
    resultsCount: (count: number) =>
      `${count} ${count === 1 ? 'country available' : 'countries available'}`,
    close: 'Close',
  },
};

@Component({
  selector: 'ngx-bootstrap-country-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './country-picker-input.component.html',
  styleUrls: ['./country-picker-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CountryPickerInputComponent),
      multi: true,
    },
  ],
})
export class CountryPickerInputComponent
  implements OnInit, OnChanges, ControlValueAccessor
{
  @ViewChild('searchInput') searchInputElement?: ElementRef<HTMLInputElement>;
  @ViewChild('phoneInput') phoneInputElement?: ElementRef<HTMLInputElement>;

  // ─── Inputs ───────────────────────────────────────────────────────────────

  /** Current country object or ISO code */
  @Input() value: Country | string | null = null;

  /** Display mode of the input ('name' | 'dialCode' | 'currency') */
  @Input() displayMode: CountryDisplayMode = 'name';

  /** Default ISO country code when no value is provided (default: 'GT') */
  @Input() defaultCountry = 'GT';

  /** Phone number value (for displayMode="dialCode") */
  @Input() phoneNumber = '';

  /** Enable auto phone masking and max digits limit */
  @Input() maskPhoneNumber = true;

  /** Custom phone mask pattern (e.g. '####-####') */
  @Input() phoneMask?: string;

  /** Custom maximum digits limit */
  @Input() maxPhoneDigits?: number;

  /** UI and country names language ('es' | 'en') */
  @Input() language: CountryLanguage = 'es';

  /** Preferred country ISO codes pinned to top */
  @Input() preferredCountries: string[] = [];

  /** Excluded country ISO codes */
  @Input() excludedCountries: string[] = [];

  /** Whether the country selector has a search field */
  @Input() searchable = true;

  /** Disable the entire component */
  @Input() disabled = false;

  /** Mark the field in an error state */
  @Input() error = false;

  /** Form label */
  @Input() label?: string;

  /** Placeholder text for country input */
  @Input() placeholder?: string;

  /** Placeholder for the search input */
  @Input() searchPlaceholder?: string;

  /** Placeholder for the phone input */
  @Input() phonePlaceholder?: string;

  /** Title displayed in the modal / dropdown header */
  @Input() modalTitle?: string;

  /** Helper text displayed below input */
  @Input() helperText?: string;

  /** Error text displayed below input when error=true */
  @Input() errorMessage?: string;

  /** Input styling mode ('outlined' | 'flat' | 'floating') */
  @Input() inputMode: CountryInputMode = 'outlined';

  /** Presentation mode ('dropdown' | 'modal') */
  @Input() modalMode: CountryModalMode = 'dropdown';

  /** Bootstrap component size ('sm' | 'md' | 'lg') */
  @Input() size: CountryPickerSize = 'md';

  /** Base CDN URL for flag images */
  @Input() flagCdnUrl = 'https://flagcdn.com/w40/';

  /** Always fallback to emoji flag instead of image */
  @Input() useEmojiFallback = false;

  /** Show dial code next to country name in the list */
  @Input() showDialCode = false;

  /** Custom CSS classes for the root element */
  @Input() customClass = '';

  // ─── Outputs ──────────────────────────────────────────────────────────────

  /** Two-way binding for country value */
  @Output() valueChange = new EventEmitter<Country | null>();

  /** Emitted when a country is selected */
  @Output() countrySelect = new EventEmitter<Country>();

  /** Two-way binding for phone number (formatted) */
  @Output() phoneNumberChange = new EventEmitter<string>();

  /** Emitted with raw clean digits of the phone number */
  @Output() rawPhoneNumberChange = new EventEmitter<string>();

  /** Emitted when modal/dropdown is opened */
  @Output() opened = new EventEmitter<void>();

  /** Emitted when modal/dropdown is closed */
  @Output() closed = new EventEmitter<void>();

  // ─── Internal State ───────────────────────────────────────────────────────

  allCountries: Country[] = COUNTRIES;
  activeCountry: Country | null = null;
  isOpen = false;
  searchQuery = '';
  internalPhone = '';
  imageLoadErrors: Record<string, boolean> = {};

  // ControlValueAccessor callbacks
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.resolveInitialCountry();
    this.syncPhoneFormat();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.resolveActiveCountry();
    }
    if (changes['phoneNumber']) {
      this.internalPhone = this.phoneNumber || '';
      this.syncPhoneFormat();
    }
    if (changes['defaultCountry'] && !this.activeCountry) {
      this.resolveInitialCountry();
    }
    if (changes['maskPhoneNumber'] || changes['phoneMask'] || changes['maxPhoneDigits']) {
      this.syncPhoneFormat();
    }
  }

  // ─── Getters ──────────────────────────────────────────────────────────────

  get t(): CountryPickerTranslations {
    return TRANSLATIONS[this.language] ?? TRANSLATIONS.en;
  }

  get effectiveLabel(): string {
    if (this.label) return this.label;
    const mode = this.displayMode ?? 'name';
    return this.t[mode]?.label ?? this.t.name.label;
  }

  get effectivePlaceholder(): string {
    if (this.placeholder) return this.placeholder;
    const mode = this.displayMode ?? 'name';
    return this.t[mode]?.placeholder ?? this.t.name.placeholder;
  }

  get effectivePhonePlaceholder(): string {
    if (this.phonePlaceholder) return this.phonePlaceholder;
    const rule = getCountryPhoneRule(this.activeCountry?.isoCode);
    return rule.placeholder || this.t.dialCode.phonePlaceholder;
  }

  get effectiveModalTitle(): string {
    if (this.modalTitle) return this.modalTitle;
    const mode = this.displayMode ?? 'name';
    return this.t[mode]?.modal ?? this.t.name.modal;
  }

  get effectiveSearchPlaceholder(): string {
    return this.searchPlaceholder || this.t.search;
  }

  get activePhoneRule(): { mask: string; maxDigits: number } {
    return getCountryPhoneRule(this.activeCountry?.isoCode);
  }

  get effectivePhoneMask(): string {
    return (
      this.phoneMask ??
      this.activeCountry?.phoneMask ??
      this.activePhoneRule.mask
    );
  }

  get effectiveMaxDigits(): number {
    return (
      this.maxPhoneDigits ??
      this.activeCountry?.maxPhoneDigits ??
      this.activePhoneRule.maxDigits
    );
  }

  get phoneMaxLength(): number | undefined {
    return getMaskMaxLength(this.effectivePhoneMask, this.effectiveMaxDigits);
  }

  get sizeClass(): string {
    if (this.size === 'sm') return 'input-group-sm form-control-sm btn-sm';
    if (this.size === 'lg') return 'input-group-lg form-control-lg btn-lg';
    return '';
  }

  get inputSizeClass(): string {
    if (this.size === 'sm') return 'form-control-sm';
    if (this.size === 'lg') return 'form-control-lg';
    return '';
  }

  get buttonSizeClass(): string {
    if (this.size === 'sm') return 'btn-sm';
    if (this.size === 'lg') return 'btn-lg';
    return '';
  }

  /**
   * Countries list filtered by exclusions and search query.
   */
  get filteredCountries(): Country[] {
    const excludedSet = new Set(this.excludedCountries.map((c) => c.toUpperCase()));
    let list = this.allCountries.filter((c) => !excludedSet.has(c.isoCode.toUpperCase()));

    // Separate preferred countries and sort to the top
    if (this.preferredCountries && this.preferredCountries.length > 0) {
      const preferredUpper = this.preferredCountries.map((c) => c.toUpperCase());
      const preferred = list.filter((c) => preferredUpper.includes(c.isoCode.toUpperCase()));
      const others = list.filter((c) => !preferredUpper.includes(c.isoCode.toUpperCase()));
      list = [...preferred, ...others];
    }

    // Filter by query
    const q = normalizeText(this.searchQuery);
    if (!q) return list;

    return list.filter((c) => {
      return (
        normalizeText(c.name).includes(q) ||
        normalizeText(c.nameEs).includes(q) ||
        c.isoCode.toLowerCase().includes(q) ||
        c.dialCode.toLowerCase().includes(q) ||
        c.currency.toLowerCase().includes(q)
      );
    });
  }

  get preferredList(): Country[] {
    if (!this.preferredCountries || this.preferredCountries.length === 0) return [];
    const upper = this.preferredCountries.map((c) => c.toUpperCase());
    return this.filteredCountries.filter((c) => upper.includes(c.isoCode.toUpperCase()));
  }

  get otherList(): Country[] {
    if (!this.preferredCountries || this.preferredCountries.length === 0) {
      return this.filteredCountries;
    }
    const upper = this.preferredCountries.map((c) => c.toUpperCase());
    return this.filteredCountries.filter((c) => !upper.includes(c.isoCode.toUpperCase()));
  }

  get displayValue(): string {
    if (!this.activeCountry) return '';
    switch (this.displayMode) {
      case 'dialCode':
        return this.activeCountry.dialCode;
      case 'currency':
        return `${this.activeCountry.currencySymbol} ${this.activeCountry.currency}`;
      case 'name':
      default:
        return this.language === 'es'
          ? this.activeCountry.nameEs
          : this.activeCountry.name;
    }
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  toggle(): void {
    if (this.disabled) return;
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.disabled || this.isOpen) return;
    this.isOpen = true;
    this.searchQuery = '';
    this.opened.emit();
    setTimeout(() => {
      this.searchInputElement?.nativeElement.focus();
    }, 60);
  }

  close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.searchQuery = '';
    this.onTouched();
    this.closed.emit();
  }

  selectCountry(country: Country): void {
    this.activeCountry = country;
    this.value = country;
    this.onChange(country);
    this.valueChange.emit(country);
    this.countrySelect.emit(country);
    this.close();

    // Re-format phone number with new country rule if in dialCode mode
    if (this.displayMode === 'dialCode' && this.maskPhoneNumber) {
      this.syncPhoneFormat();
    }
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const rawValue = input.value;

    if (this.maskPhoneNumber) {
      const rawDigits = cleanDigits(rawValue).slice(0, this.effectiveMaxDigits);
      const formatted = this.effectivePhoneMask
        ? formatWithMask(rawDigits, this.effectivePhoneMask)
        : rawDigits;

      this.internalPhone = formatted;
      input.value = formatted;
      this.phoneNumber = formatted;
      this.phoneNumberChange.emit(formatted);
      this.rawPhoneNumberChange.emit(rawDigits);
    } else {
      const limited = this.maxPhoneDigits
        ? rawValue.slice(0, this.maxPhoneDigits)
        : rawValue;
      this.internalPhone = limited;
      input.value = limited;
      this.phoneNumber = limited;
      this.phoneNumberChange.emit(limited);
      this.rawPhoneNumberChange.emit(cleanDigits(limited));
    }
    this.onTouched();
  }

  clearSearch(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.searchQuery = '';
    this.searchInputElement?.nativeElement.focus();
  }

  getCountryDisplayName(country: Country): string {
    return this.language === 'es' ? country.nameEs : country.name;
  }

  getCountrySubtitle(country: Country): string {
    if (this.displayMode === 'currency') {
      return `${country.isoCode} · ${country.currencySymbol} ${country.currency}`;
    }
    if (this.showDialCode || this.displayMode === 'dialCode') {
      return `${country.isoCode} · ${country.dialCode}`;
    }
    return country.isoCode;
  }

  getFlag(country?: Country | null): string {
    if (!country) return '';
    return getFlagUrl(country.isoCode, this.flagCdnUrl);
  }

  getEmoji(country?: Country | null): string {
    if (!country) return '🌐';
    return getCountryEmoji(country.isoCode);
  }

  onImageError(isoCode: string): void {
    this.imageLoadErrors[isoCode] = true;
  }

  hasImageError(isoCode?: string): boolean {
    if (!isoCode) return true;
    return !!this.imageLoadErrors[isoCode] || this.useEmojiFallback;
  }

  // ─── Click Outside Listener ───────────────────────────────────────────────

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen) return;
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) {
      this.close();
    }
  }

  // ─── ControlValueAccessor ─────────────────────────────────────────────────

  writeValue(val: any): void {
    this.value = val;
    this.resolveActiveCountry();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private resolveInitialCountry(): void {
    if (this.value) {
      this.resolveActiveCountry();
      return;
    }
    if (this.defaultCountry) {
      const match = this.allCountries.find(
        (c) => c.isoCode.toUpperCase() === this.defaultCountry.toUpperCase()
      );
      if (match) {
        this.activeCountry = match;
        this.value = match;
      }
    }
  }

  private resolveActiveCountry(): void {
    if (!this.value) {
      this.activeCountry = null;
      return;
    }
    if (typeof this.value === 'object' && 'isoCode' in this.value) {
      this.activeCountry = this.value as Country;
      return;
    }
    if (typeof this.value === 'string' && this.value.trim()) {
      const code = this.value.trim().toUpperCase();
      this.activeCountry =
        this.allCountries.find((c) => c.isoCode.toUpperCase() === code) || null;
    }
  }

  private syncPhoneFormat(): void {
    const raw = cleanDigits(this.internalPhone);
    if (!raw) return;

    if (this.maskPhoneNumber) {
      const limited = raw.slice(0, this.effectiveMaxDigits);
      const formatted = this.effectivePhoneMask
        ? formatWithMask(limited, this.effectivePhoneMask)
        : limited;
      this.internalPhone = formatted;
      this.phoneNumber = formatted;
      this.phoneNumberChange.emit(formatted);
      this.rawPhoneNumberChange.emit(limited);
    }
  }
}

# ngx-bootstrap-country-picker

Selector de países y teléfono internacional para **Angular 21** estilizado con **Bootstrap 5**.

Incluye soporte para formularios reactivos (`ReactiveFormsModule` / `ControlValueAccessor`), enmascaramiento automático de números telefónicos por país, selección de moneda y búsqueda integrada.

---

## Características

- **195 países** con banderas optimizadas vía CDN y respaldo de emojis.
- 📞 **Modo `dialCode`**: prefijo telefónico internacional junto a campo de teléfono editable.
- **Máscara telefónica automática**: limita y formatea dígitos según las reglas de cada país (p. ej. Guatemala max 8 dígitos `1234-5678`).
- 💱 **Modo `currency`**: selector de moneda con código ISO y símbolo.
-  **Bootstrap 5 nativo**: diseñado para integrarse con `form-control`, `input-group` y `modal`.
-  **Buscador interactivo**: filtra en tiempo real por nombre (inglés y español), ISO y código telefónico.
- 🌐 **Bilingüe**: soporte nativo para inglés (`en`) y español (`es`).
- **Países preferidos**: fija países al inicio de la lista.
- **Angular 21**: componente `standalone` listo para usar.

---

## Instalación

```bash
npm install ngx-bootstrap-country-picker
```

Asegúrate de tener Bootstrap 5 en tu proyecto Angular (en `angular.json` o importado en tu `styles.scss`):

```scss
@import 'bootstrap/dist/css/bootstrap.min.css';
```

---

## Uso básico

### 1. Importar el componente standalone

```typescript
import { Component } from '@angular/core';
import { CountryPickerInputComponent, Country } from 'ngx-bootstrap-country-picker';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CountryPickerInputComponent],
  template: `
    <ngx-bootstrap-country-picker
      [(value)]="selectedCountry"
      (countrySelect)="onCountrySelect($event)"
      label="País de residencia"
      defaultCountry="GT"
      language="es">
    </ngx-bootstrap-country-picker>
  `
})
export class DemoComponent {
  selectedCountry: Country | null = null;

  onCountrySelect(country: Country) {
    console.log('País seleccionado:', country);
  }
}
```

---

### 2. Modo Teléfono (`displayMode="dialCode"`)

Combina el selector de prefijo con un campo de teléfono con formateo automático de dígitos:

```html
<ngx-bootstrap-country-picker
  displayMode="dialCode"
  defaultCountry="GT"
  [(phoneNumber)]="phone"
  (rawPhoneNumberChange)="onRawPhone($event)"
  [preferredCountries]="['GT', 'SV', 'HN', 'MX', 'US']"
  [maskPhoneNumber]="true"
  label="Número de contacto">
</ngx-bootstrap-country-picker>
```

---

### 3. Modo Moneda (`displayMode="currency"`)

Muestra el símbolo y código ISO de la moneda:

```html
<ngx-bootstrap-country-picker
  displayMode="currency"
  defaultCountry="GT"
  [(value)]="currencyCountry">
</ngx-bootstrap-country-picker>
```

---

### 4. Integración con Formularios Reactivos (`ReactiveFormsModule`)

El componente implementa `ControlValueAccessor`, por lo que puedes usar `formControl` o `formControlName`:

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CountryPickerInputComponent } from 'ngx-bootstrap-country-picker';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CountryPickerInputComponent],
  template: `
    <form [formGroup]="form">
      <ngx-bootstrap-country-picker
        formControlName="country"
        label="País">
      </ngx-bootstrap-country-picker>
    </form>
  `
})
export class FormDemoComponent {
  fb = inject(FormBuilder);
  form = this.fb.group({
    country: ['GT']
  });
}
```

---

## Propiedades principales (Inputs)

| Propiedad | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `displayMode` | `'name' \| 'dialCode' \| 'currency'` | `'name'` | Modo de visualización |
| `defaultCountry` | `string` | `'GT'` | Código ISO predeterminado |
| `value` | `Country \| string \| null` | `null` | Valor del país seleccionado |
| `phoneNumber` | `string` | `''` | Valor del teléfono en modo dialCode |
| `maskPhoneNumber` | `boolean` | `true` | Habilita máscara y límite de dígitos |
| `phoneMask` | `string` | `undefined` | Sobrescribe máscara personalizada |
| `maxPhoneDigits` | `number` | `undefined` | Sobrescribe límite de dígitos |
| `language` | `'es' \| 'en'` | `'es'` | Idioma de nombres y textos |
| `preferredCountries`| `string[]` | `[]` | Códigos ISO fijados al inicio |
| `excludedCountries` | `string[]` | `[]` | Códigos ISO a excluir |
| `modalMode` | `'dropdown' \| 'modal'` | `'dropdown'` | Desplegable o ventana modal |
| `inputMode` | `'outlined' \| 'flat'` | `'outlined'` | Borde completo o subrayado |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño según Bootstrap |
| `searchable` | `boolean` | `true` | Activa caja de búsqueda |
| `disabled` | `boolean` | `false` | Deshabilita el control |
| `error` | `boolean` | `false` | Activa estilo de error |
| `errorMessage` | `string` | `undefined` | Mensaje de error a mostrar |
| `helperText` | `string` | `undefined` | Texto de ayuda inferior |

---

## Eventos (Outputs)

| Evento | Parámetro | Descripción |
| :--- | :--- | :--- |
| `valueChange` | `Country \| null` | Emite cuando cambia la selección |
| `countrySelect` | `Country` | Emite el objeto `Country` seleccionado |
| `phoneNumberChange` | `string` | Emite el número telefónico formateado |
| `rawPhoneNumberChange` | `string` | Emite únicamente los dígitos limpios |
| `opened` | `void` | Emite al abrir selector |
| `closed` | `void` | Emite al cerrar selector |

---

## Licencia

MIT © Luis Batres


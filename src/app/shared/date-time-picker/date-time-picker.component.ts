/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  Component,
  Input,
  forwardRef,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from '@angular/forms';
import {
  IonModal,
  IonDatetime,
  IonButtons,
  IonButton,
} from '@ionic/angular/standalone';
import { NgClass } from '@angular/common';
import { MmDateTimeFormatPipe } from '../mm-date-time-format.pipe';

const moduleName = 'DateTimePickerComponent';

/**
 * Wrap the ionic date time so get a consistent setup
 */
@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true,
    },
  ],
  imports: [
    IonModal,
    IonDatetime,
    IonButtons,
    IonButton,
    FormsModule,
    NgClass,
    MmDateTimeFormatPipe,
  ],
})
export class DateTimePickerComponent implements ControlValueAccessor {
  // Simple static counter for auto id generation.
  private static _nextId = 1;

  /** Required by ControlValueAccessor */
  public onChange = (_: any) => {};

  /** Required by ControlValueAccessor */
  public onTouched = () => {};

  /** Value as UTC ISO  datetime string*/
  @Input() public set min(value: string) {
    if (value) {
      this.ionDateTimeMin = this.convertIsoLocalStringToIsoUTCString(value);
    } else {
      this.ionDateTimeMin = null;
    }
  }

  /** Value as UTC ISO  datetime string*/
  @Input() public set max(value: string) {
    if (value) {
      this.ionDateTimeMax = this.convertIsoLocalStringToIsoUTCString(value);
    } else {
      this.ionDateTimeMax = null;
    }
  }

  /** Optional initial value if NOT bound via Angular forms (only use in template-driven / standalone usage). */
  @Input() public set value(value: string) {
    // If the control is also part of a form, the form API will later call writeValue.
    this.ionDateTimeValue = value;
  }

  /** Disabled property */
  @Input() public disabled: boolean = false;

  /**
   * Use this to set a unique Id, instead of using formName. eg if being used in an ngFor we may not be able to use
   * the repeated formName (in a forArray).
   * Just make sure set it after formControlName in the attribute list.
   */
  @Input() public set id(value: string) {
    this.triggerId = value;
  }

  // NOTE: Do NOT declare an @Input() named 'formControlName'. That name is reserved for the Reactive Forms directive.
  // If we tried to piggy-back on it, Angular's forms infrastructure may still work, but it is unsupported and can
  // interfere with correct detection / value propagation. Use 'id' (already supported) or 'controlId' instead.
  @Input() public set controlId(value: string) {
    if (value) {
      this.triggerId = value;
    }
  }
  /** call when the date time model is updated. Emits date time ISO string in UTC */
  @Output() public dateTimeUpdated = new EventEmitter<string>();

  /** The value that the datetime uses (0 offset time) */
  public ionDateTimeValue: string | null = null;

  /** The value that the datetime uses (0 offset time) */
  public ionDateTimeMin: string | null = null;

  /** The value that the datetime uses (0 offset time) */
  public ionDateTimeMax: string | null = null;

  /** Set if we are running windows */
  public isWindows = false;


  /** Date time format to use for the add/edit task dialog */
  public dateTimePattern: string;

  /** Current culture */
  public culture: string;

  /** Set if we are in dark mode */
  public isDarkMode: boolean = false;

  /** The trigger Id for the datetime modal */
  public triggerId: string = '';

  /**
   * Construction
   *
   * @param runtimeServices - runtime services
   * @param platformService - platform Services
   * @param logger - logger
   * @param translate - translation services
   */
  constructor() {
    this.dateTimePattern = 'd MMMM yyyy h:mm a';
    this.culture = 'en';
  }

  /**
   * Update value used by ionDateTime
   */
  private updateValue(newVal: string): void {
    this.ionDateTimeValue = this.convertIsoLocalStringToIsoUTCString(newVal);
  }

  private convertIsoLocalStringToIsoUTCString(isoLocalString: string): string {
    const converted = new Date(isoLocalString);

    // The toISOString seems to apply the offset, and add the Z, so don't need to do manually here
    let result = converted.toISOString();
    return result;
  }

  /**
   * ControlValueAccessor implementation
   */
  public writeValue(obj: any): void {
    // Angular will call writeValue with: initial form value (may be null/undefined), resets, patches.
    // We should still clear internal value if null rather than early-returning.

    if (!this.triggerId) {
      // Fallback: generate a stable unique id so the modal trigger still works even if the template author
      // forgot to set [id] or [controlId].
      this.triggerId = `dtp_${DateTimePickerComponent._nextId++}`;
    }

    if (obj == null || obj === '') {
      this.ionDateTimeValue = undefined as any; // clears value
      return;
    }

    try {
      const utcDateTime = this.convertIsoLocalStringToIsoUTCString(
        obj as string
      );
      this.updateValue(utcDateTime);
    } catch (e) {
      console.error(`${moduleName}.writeValue parse error:`, e);      
    }
  }

  /**
   * Handler for when user updates, and clicks ok
   * @param ev
   */
  public ionChange(ev: any): void {
    try {
      this.ionDateTimeValue = ev.detail.value;

      // convert back to UTC string for the hosting reactive form
      const utcDateTime = this.convertIsoLocalStringToIsoUTCString(
        this.ionDateTimeValue as string
      );
      this.onChange(utcDateTime);
      this.dateTimeUpdated.emit(utcDateTime);
    } catch (error) {
      console.error(`${moduleName}.ionChange: `, error);      
    }
  }

  /**
   * ControlValueAccessor implementation
   */

  public registerOnChange(fn: (value: any) => any): void {
    this.onChange = fn;
  }

  /**
   * ControlValueAccessor implementation
   */
  public registerOnTouched(fn: () => any): void {
    this.onTouched = fn;
  }

  /**
   * ControlValueAccessor implementation
   */
  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

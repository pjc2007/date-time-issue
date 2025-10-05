import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateTimePickerComponent } from '../shared/date-time-picker/date-time-picker.component';

interface FormConfig {
  dateTime: FormControl<string | null>;
}


@Component({
  selector: 'app-get-date-time-form',
  templateUrl: './get-date-time-form.component.html',
  styleUrls: ['./get-date-time-form.component.scss'],
  imports: [DateTimePickerComponent, FormsModule, ReactiveFormsModule],
})
export class GetDateTimeFormComponent implements OnInit {
  /** The main form */
  public mainForm!: FormGroup<FormConfig>;

  public formFieldNamesDateTime = 'dateTime';

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    const now = new Date().toISOString();
    const formConfig: FormConfig = {
      dateTime: new FormControl(now),
    };

    this.mainForm = this.formBuilder.group(formConfig);
  }
}

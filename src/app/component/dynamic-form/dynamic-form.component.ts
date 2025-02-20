import {Component, Input, OnInit, signal} from '@angular/core';
import {IForm, IFormDataFields} from '../../models';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';

enum fieldNameEnum {
  confirmPassword = 'confirmPassword',
  newPassword = 'newPassword'
}

enum fieldTypeEnum {
  text = 'TEXT',
  newPassword = 'NEW_PASSWORD'
}

@Component({
  selector: 'app-dynamic-form',
  /**بهتر یک share material module ااستفاده بشه*/
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatButton,
    MatFormField,
    MatInputModule,
    MatTooltip,
    MatIconButton,
    MatIconModule
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})

export class DynamicFormComponent implements OnInit {

  get fieldNameEnum(): typeof fieldNameEnum {
    return fieldNameEnum
  }

  get fieldTypeEnum(): typeof fieldTypeEnum {
    return fieldTypeEnum
  }

  /** داده‌های ورودی برای فرم */
  @Input({required: true}) formData!: IForm;

  /** وضعیت نمایش/مخفی پسورد */
  showHidePassword = signal(true);

  /** گروه فرم که شامل تمامی فیلدها و اعتبارسنجی‌ها می‌باشد */
  form!: FormGroup;

  /**
   * سازنده کامپوننت که به سرویس FormBuilder برای ساخت فرم دسترسی می‌دهد.
   *
   * @param fb سرویس FormBuilder برای ساخت فرم‌ها
   */
  constructor(private fb: FormBuilder) {
  }

  /**
   * این متد هنگام بارگذاری کامپوننت فراخوانی می‌شود.
   * در این متد داده‌های ورودی  و فرم ایجاد می‌شود.
   */
  ngOnInit() {
    this.initializeForm();
  }

  /**
   * فرم را با توجه به داده‌های ورودی (formData) ایجاد می‌کند.
   */
  initializeForm(): void {
    const formGroup: any = {};

    this.formData.fields.forEach(field => {
      const validators = this.getValidatorsForField(field);
      if (field.showConfirmPassword) {
        formGroup[this.fieldNameEnum.confirmPassword] = ['', [Validators.required, this.confirmPasswordValidator()]];
      }
      formGroup[field.name] = ['', validators];
    });

    this.form = this.fb.group(formGroup);
    console.log(this.form);
  }


  /**
   * اعتبارسنجی‌های مربوط به هر فیلد را برمی‌گرداند.
   *
   * @param field اطلاعات فیلد که باید اعتبارسنجی شود
   * @returns لیستی از اعتبارسنجی‌ها
   */
  getValidatorsForField(field: IFormDataFields): Validators[] {
    const validators = [];

    if (field?.required) validators.push(Validators.required);
    if (field?.minLength) validators.push(Validators.minLength(field?.minLength));
    if (field?.maxLength) validators.push(Validators.maxLength(field?.maxLength));
    if (field?.regex) validators.push(Validators.pattern(field?.regex));

    return validators;
  }


  /**
   * اعتبارسنجی سفارشی برای مطابقت رمز عبور و تأیید رمز عبور.
   * این متد بررسی می‌کند که آیا رمز عبور و تأیید آن برابر هستند یا خیر.
   *
   * @returns یک شیء خطا در صورتی که رمز عبور و تأیید آن برابر نباشند
   */
  confirmPasswordValidator() {
    return (control: any) => {
      const password = this.form?.get(this.fieldNameEnum.newPassword)?.value;

      if (control.value && control.value !== password) {
        this.form?.controls[this.fieldNameEnum.confirmPassword]?.setErrors({confirmPassword: true});
        return {confirmPassword: 'Passwords do not match'};
      } else {
        this.form?.controls[this.fieldNameEnum.confirmPassword]?.setErrors({confirmPassword: false});
      }

      return null;
    };
  }

  /**نمایش خطاهای ورودی ها*/
  isFieldInvalid(field: IFormDataFields): boolean | undefined {
    const control = this?.form?.get(field?.name);
    return control?.invalid && (control?.touched || control?.dirty);
  }


  /**
   * این متد برای تغییر وضعیت نمایش یا مخفی کردن پسورد فرم استفاده می‌شود.
   * @param event رویداد ماوس که هنگام کلیک روی دکمه فراخوانی می‌شود
   */
  clickEvent(event: MouseEvent) {
    this.showHidePassword.set(!this.showHidePassword());
    event.stopPropagation();
  }

  /**
   * متد ارسال فرم که فقط زمانی اجرا می‌شود که فرم معتبر باشد.
   * در صورتی که فرم معتبر باشد، داده‌های فرم در کنسول نمایش داده می‌شود.
   * همچنین اگر فیلدی معتبر نباشد، نام آن در کنسول چاپ می‌شود.
   */
  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }

    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      if (control && control.invalid) {
        console.log(`${field} is invalid`);
      }
    });
  }
}

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormDataService} from '../../services';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {DynamicFormComponent} from '../dynamic-form/dynamic-form.component';
import {IFormData} from '../../models';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-sign-up',
  /**بهتر یک share material module ااستفاده بشه*/
  imports: [CommonModule, HttpClientModule, DynamicFormComponent, MatProgressSpinner],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormDataService]
})

export class SignUpComponent implements OnInit {

  /** داده‌های فرم */
  formData!: IFormData;

  /** وضعیت لود شدن */
  isLoading = true;

  /**
   * سازنده کامپوننت که به سرویس‌ها دسترسی می‌دهد.
   * @param formDataService سرویس برای دریافت داده‌های فرم از API
   * @param changeDetectorRef  برای تغییرات دسترسی به تشخیص تغییرات
   */
  constructor(private formDataService: FormDataService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  /**
   * در این متد، داده‌های فرم بارگذاری می‌شوند.
   * این متد هنگام شروع کامپوننت فراخوانی می‌شود.
   */
  ngOnInit() {
    this.getFormData();
  }

  /**
   * متد برای دریافت داده‌های فرم از سرویس.
   *
   * این متد درخواست GET به API ارسال می‌کند و داده‌های فرم را به کامپوننت ارسال می‌کند.
   * هنگام دریافت داده‌ها، وضعیت لودینگ به false تغییر می‌کند.
   */
  getFormData(): void {
    this.isLoading = true;
    this.formDataService.getFormData().subscribe({
      next: (res) => {
        // وقتی داده‌ها دریافت شد، آن‌ها به formData اختصاص داده می‌شوند
        // async pipe استفاده نشده به دلایل مختلف
        this.formData = res;
      },
      complete: () => {
        // پس از تکمیل درخواست، وضعیت لودینگ به false تغییر می‌کند و تغییرات تشخیص داده می‌شود
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}

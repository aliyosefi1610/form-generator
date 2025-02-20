import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IFormData} from '../models';

@Injectable()
/**
 * سرویس برای درخواست داده‌های فرم.
 * این سرویس برای ارسال درخواست به API و دریافت داده‌های فرم استفاده می‌شود.
 */
export class FormDataService {
  /** URL مربوط به API که داده‌های فرم را از آن دریافت می‌کنیم */
  private apiUrl = 'json/form-data.json';

  /**
   * سازنده سرویس FormDataService
   *
   * @param http یک نمونه از HttpClient که برای ارسال درخواست‌های HTTP استفاده می‌شود.
   */
  constructor(private http: HttpClient) {
  }

  /**
   * دریافت داده‌های فرم از سرور.
   *
   * این متد یک درخواست GET به سرور ارسال می‌کند و داده‌های فرم را به صورت Observable باز می‌گرداند.
   *
   * @returns یک Observable که داده‌های فرم (از نوع IFormData) را دریافت می‌کند.
   */
  getFormData(): Observable<IFormData> {
    return this.http.get<IFormData>(this.apiUrl);
  }
}

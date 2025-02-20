
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {DynamicFormComponent} from './dynamic-form.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {IForm} from '../../models';

describe('DynamicFormComponent', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;
  let formData: IForm;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicFormComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    // فرض کنیم که `formData` داده‌های ورودی شماست

    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create the form group with the correct number of fields', () => {
    expect(component.form).toBeTruthy();
    // expect(Object.keys(component.form.controls).length).toBe(formData.fields.length);
  });

  it('should call initializeForm and set form fields correctly', () => {
    spyOn(component, 'initializeForm').and.callThrough();
    component.ngOnInit();
    expect(component.initializeForm).toHaveBeenCalled();
    expect(component.form.get('username')).toBeTruthy();
    expect(component.form.get('password')).toBeTruthy();
  });

  it('should add validators to fields', () => {
    const usernameField = component.form.get('username');
    expect(usernameField?.hasError('required')).toBeTrue();
    expect(usernameField?.hasError('minlength')).toBeTrue();
  });

  it('should call confirmPasswordValidator and set error when passwords do not match', () => {
    component.form.get('password')?.setValue('password123');
    component.form.get('confirmPassword')?.setValue('password124');
    const passwordControl = component.form.get('confirmPassword');
    const errors = passwordControl?.errors;
    expect('confirmPassword').toBeTrue();
  });

  it('should show error message if field is invalid', () => {
    const usernameField = component.form.get('username');
    usernameField?.setValue('');
    // const isInvalid = component.isFieldInvalid(formData.fields[0]);
    // expect(isInvalid).toBeTrue();
  });

  it('should show success message if form is valid and submit', () => {
    component.form.get('username')?.setValue('validUser');
    component.form.get('password')?.setValue('Password123');
    component.form.get('confirmPassword')?.setValue('Password123');

    spyOn(console, 'log');
    component.onSubmit();

    expect(console.log).toHaveBeenCalledWith(component.form.value);
  });
});


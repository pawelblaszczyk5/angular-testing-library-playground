import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form.component';
import { MockModule, MockProvider, ngMocks } from 'ng-mocks';
import { MatInputModule } from '@angular/material/input';
import { FormService } from '../../services/form.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

describe('FormComponent bad tests', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [ReactiveFormsModule, MockModule(MatInputModule)],
      providers: [
        MockProvider(FormService, {
          saveForm: () => of(true),
        }),
        MockProvider(MatSnackBar),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render properly', () => {
    expect(component).not.toBeUndefined();
  });

  it('should submit form', () => {
    component.form.get('name')?.patchValue('test');
    component.form.get('surname')?.patchValue('test');
    component.form.get('password')?.patchValue('Zxcvbnm123');

    const formSaveSpy = jest.spyOn(
      ngMocks.findInstance(FormService),
      'saveForm'
    );

    component.handleSubmit();

    expect(formSaveSpy).toHaveBeenCalledWith({
      name: 'test',
      surname: 'test',
      password: 'Zxcvbnm123',
    });
  });
});

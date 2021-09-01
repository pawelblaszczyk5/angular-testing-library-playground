import { FormComponent } from './form.component';
import { render, screen, RenderResult } from '@testing-library/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MockProvider } from 'ng-mocks';
import { FormService } from './services/form.service';
import { of } from 'rxjs';
import userEvent from '@testing-library/user-event';

describe('FormComponent', () => {
  let renderResult: RenderResult<FormComponent>;

  beforeEach(async () => {
    renderResult = await render(FormComponent, {
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatSnackBarModule,
      ],
      providers: [
        MockProvider(FormService, {
          saveForm: () => of(true),
        }),
      ],
    });
  });

  test('should render component succesfully', () => {
    expect(renderResult).not.toBeUndefined();
  });

  test('should have big fat header', () => {
    expect(screen.getByText('Super hiper form'));
  });

  describe('form error handling', () => {
    test('form submition', () => {
      userEvent.click(screen.getByText('Save that'));

      expect(
        screen.getByText('Make sure form is completed without errors')
      ).toBeInTheDocument();
      userEvent.click(screen.getByText('Close'));

      userEvent.type(screen.getByLabelText('Name'), 'faf');
      userEvent.type(screen.getByLabelText('Surname'), 'faf');
      userEvent.type(screen.getByLabelText('Password'), 'Zxcvbnm123');
      userEvent.click(screen.getByText('Save that'));

      expect(
        screen.queryByText('Make sure form is completed without errors')
      ).not.toBeInTheDocument();
    });

    test('name field validation', () => {
      userEvent.click(screen.getByLabelText('Name'));
      userEvent.tab();

      expect(screen.getByText('This field is required')).toBeInTheDocument();

      userEvent.type(screen.getByLabelText('Name'), 'fa');
      expect(screen.getByLabelText('Name')).toBeInvalid();

      expect(
        screen.getByText(
          'This field is required to have at least a few characters'
        )
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Name')).toBeInvalid();

      userEvent.type(screen.getByLabelText('Name'), 'f');
      expect(screen.getByLabelText('Name')).toBeValid();
    });
  });

  test('can print fancy structure for debugging', () => {
    // renderResult.debug();
  });
});

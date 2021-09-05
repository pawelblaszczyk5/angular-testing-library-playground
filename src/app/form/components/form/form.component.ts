import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent {
  public form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    surname: new FormControl('', [
      Validators.required,
      Validators.maxLength(6),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
    ]),
  });

  constructor(
    private formService: FormService,
    private snackBar: MatSnackBar
  ) {}

  public handleSubmit(): void {
    if (!this.form.valid) {
      this.snackBar.open(
        'Make sure form is completed without errors',
        'Close',
        { duration: 3000 }
      );
      return;
    }
    this.formService.saveForm(this.form.value).subscribe(
      (savedSuccesfully) => {
        this.snackBar.open(
          savedSuccesfully
            ? 'Saved succesfully'
            : 'Something is wrong with your form',
          'Close',
          { duration: 3000 }
        );
      },
      () => {
        this.snackBar.open('Error while saving the form', 'Close', {
          duration: 3000,
        });
      }
    );
  }
}

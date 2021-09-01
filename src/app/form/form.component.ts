import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormService } from './services/form.service';
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
        'Upewnij się, że formularz jest poprawnie wyświetlany',
        'Zamknij',
        { duration: 3000 }
      );
      return;
    }
    this.formService.saveForm(this.form.value).subscribe((savedSuccesfully) => {
      this.snackBar.open(
        savedSuccesfully ? 'Zapisano poprawnie' : 'Czemu masz na imię Tomek?',
        'Zamknij',
        { duration: 3000 }
      );
    });
  }
}
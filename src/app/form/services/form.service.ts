import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor() {}

  public saveForm(form: Record<string, unknown>): Observable<boolean> {
    return of(form.name !== 'Tomek');
  }
}

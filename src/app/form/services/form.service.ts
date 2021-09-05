import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class FormService {
  constructor(private http: HttpClient) {}

  public saveForm(form: Record<string, unknown>): Observable<boolean> {
    return this.http.post<boolean>('/api/form', form);
  }
}

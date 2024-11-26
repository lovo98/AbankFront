import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7133/api/User';

  constructor(private http: HttpClient) {}

  login(
    usuario: string | undefined,
    password: string | undefined
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/login?usuario=${usuario}&password=${password}`,
      null
    );
  }
}

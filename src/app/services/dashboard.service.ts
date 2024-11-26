import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'https://localhost:7133/api';

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Employee`);
  }

  addEmployee(datos: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Employee`, datos);
  }

  editEmployee(datos: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Employee`, datos);
  }
}

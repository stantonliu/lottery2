import { map } from 'rxjs/operators';
import { StaffAdd } from './../../models/staff/staff-add.model';
import { Staff } from './../../models/staff/staff.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  urlRoot = 'http://localhost:5001/api';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getStaffsLengthForRound(roundId: string): Observable<number> {
    const url = `${this.urlRoot}/rounds/${roundId}/staffs/length`;
    return this.http.get<number>(url, this.httpOptions);
  }

  getStaffsForRound(roundId: string, pageIndex: number, pageSize: number): Observable<Staff[]> {
    const url = `${this.urlRoot}/rounds/${roundId}/staffs?pageNumber=${pageIndex}&pageSize=${pageSize}`;
    return this.http.get<Staff[]>(url, this.httpOptions);
  }

  getStaffForRound(roundId: string, staffId: string): Observable<Staff> {
    const url = `${this.urlRoot}/rounds/${roundId}/staffs/${staffId}`;
    return this.http.get<Staff>(url, this.httpOptions);
  }

  createStaffForRound(roundId: string, staff: StaffAdd): Observable<Staff> {
    const url = `${this.urlRoot}/rounds/${roundId}/staffs`;
    return this.http.post(url, staff, this.httpOptions).pipe(
      map((newStaff: Staff) => newStaff)
    );
  }

  getRandomStaffForRound(roundId: string): Observable<Staff> {
    const url = `${this.urlRoot}/rounds/${roundId}/staffs/random`;
    return this.http.get<Staff>(url, this.httpOptions);
  }

}

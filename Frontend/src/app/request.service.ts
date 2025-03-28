import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaderResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private url: string = 'http://localhost:3000';

  constructor(private client: HttpClient) {}

  getItems(): Observable<Object> {
    return this.client.get(`${this.url}/files`);
  }

  uploadItem(file: File): Observable<Object> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });

    return this.client.post(`${this.url}/upload`, formData, {
      headers: headers,
      responseType: 'text',
    });
  }
}

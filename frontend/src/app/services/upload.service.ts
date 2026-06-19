import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MediaItem } from '../models/note.model';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly api = 'http://localhost:3000/api/upload';

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<MediaItem> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<MediaItem>(this.api, form);
  }
}

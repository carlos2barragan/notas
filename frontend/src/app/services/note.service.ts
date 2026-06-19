import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note, CreateNoteDto } from '../models/note.model';

@Injectable({ providedIn: 'root' })
export class NoteService {
  private readonly api = 'http://localhost:3000/api/notes';

  constructor(private http: HttpClient) {}

  getNotes(search?: string, tag?: string): Observable<Note[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (tag) params = params.set('tag', tag);
    return this.http.get<Note[]>(this.api, { params });
  }

  getNote(id: string): Observable<Note> {
    return this.http.get<Note>(`${this.api}/${id}`);
  }

  createNote(note: CreateNoteDto): Observable<Note> {
    return this.http.post<Note>(this.api, note);
  }

  updateNote(id: string, note: Partial<CreateNoteDto>): Observable<Note> {
    return this.http.put<Note>(`${this.api}/${id}`, note);
  }

  deleteNote(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag, CreateTagDto } from '../models/tag.model';

@Injectable({ providedIn: 'root' })
export class TagService {
  private readonly api = 'http://localhost:3000/api/tags';

  constructor(private http: HttpClient) {}

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.api);
  }

  createTag(tag: CreateTagDto): Observable<Tag> {
    return this.http.post<Tag>(this.api, tag);
  }

  updateTag(id: string, tag: Partial<CreateTagDto>): Observable<Tag> {
    return this.http.put<Tag>(`${this.api}/${id}`, tag);
  }

  deleteTag(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }
}

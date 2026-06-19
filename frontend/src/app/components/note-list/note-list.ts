import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="note-list">
      <div *ngIf="notes.length === 0" class="empty">No hay notas aún.</div>
      <div
        *ngFor="let note of notes"
        class="note-card"
        [class.selected]="selectedId === note._id"
        (click)="select.emit(note)"
      >
        <div class="note-header">
          <span class="pin" *ngIf="note.isPinned">📌</span>
          <span class="title">{{ note.title }}</span>
        </div>
        <p class="preview">{{ note.content | slice:0:80 }}{{ note.content.length > 80 ? '…' : '' }}</p>
        <div class="note-tags">
          <span
            *ngFor="let tag of note.tags"
            class="tag"
            [style.background-color]="tag.color + '22'"
            [style.color]="tag.color"
            [style.border-color]="tag.color"
          >{{ tag.name }}</span>
        </div>
        <span class="date">{{ note.updatedAt | date:'d MMM y' }}</span>
      </div>
    </div>
  `,
  styles: [`
    .note-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .empty { color: #9ca3af; text-align: center; padding: 2rem 0; }
    .note-card {
      padding: 0.85rem 1rem; border-radius: 10px; border: 1.5px solid #e5e7eb;
      cursor: pointer; transition: all 0.15s;
      &:hover { border-color: #6366f1; background: #f5f3ff; }
      &.selected { border-color: #6366f1; background: #eef2ff; }
    }
    .note-header { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.2rem; }
    .title { font-weight: 600; font-size: 0.95rem; }
    .preview { font-size: 0.82rem; color: #6b7280; margin: 0.2rem 0 0.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .note-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.4rem; }
    .tag { padding: 0.1rem 0.5rem; border-radius: 999px; border: 1px solid; font-size: 0.72rem; }
    .date { font-size: 0.72rem; color: #9ca3af; }
  `]
})
export class NoteListComponent {
  @Input() notes: Note[] = [];
  @Input() selectedId: string | null = null;
  @Output() select = new EventEmitter<Note>();
}

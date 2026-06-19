import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from '../../models/note.model';
import { Tag } from '../../models/tag.model';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="editor" *ngIf="note; else placeholder">
      <div class="editor-header">
        <input [(ngModel)]="title" class="title-input" placeholder="Título de la nota" (blur)="save()" />
        <button class="pin-btn" (click)="togglePin()" [title]="note.isPinned ? 'Desanclar' : 'Anclar'">
          {{ note.isPinned ? '📌' : '📍' }}
        </button>
        <button class="delete-btn" (click)="deleteNote()">Eliminar</button>
      </div>
      <div class="tags-section">
        <span
          *ngFor="let tag of availableTags"
          class="tag-toggle"
          [class.active]="isTagActive(tag._id)"
          [style.border-color]="tag.color"
          [style.background-color]="isTagActive(tag._id) ? tag.color : ''"
          [style.color]="isTagActive(tag._id) ? '#fff' : tag.color"
          (click)="toggleTag(tag._id)"
        >{{ tag.name }}</span>
      </div>
      <textarea
        [(ngModel)]="content"
        class="content-area"
        placeholder="Escribe tu nota aquí..."
        (blur)="save()"
      ></textarea>
    </div>
    <ng-template #placeholder>
      <div class="placeholder">
        <p>Selecciona una nota o crea una nueva</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .editor { display: flex; flex-direction: column; height: 100%; padding: 1.5rem; box-sizing: border-box; }
    .editor-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; }
    .title-input {
      flex: 1; font-size: 1.3rem; font-weight: 700; border: none; outline: none;
      border-bottom: 2px solid #e5e7eb; padding-bottom: 0.3rem;
      &:focus { border-color: #6366f1; }
    }
    .pin-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; }
    .delete-btn {
      padding: 0.3rem 0.8rem; background: #fee2e2; color: #dc2626;
      border: 1px solid #fca5a5; border-radius: 6px; cursor: pointer;
      &:hover { background: #fecaca; }
    }
    .tags-section { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; }
    .tag-toggle {
      padding: 0.15rem 0.6rem; border-radius: 999px; border: 1.5px solid;
      cursor: pointer; font-size: 0.78rem; transition: all 0.15s;
    }
    .content-area {
      flex: 1; resize: none; border: 1px solid #e5e7eb; border-radius: 8px;
      padding: 0.75rem; font-size: 0.95rem; line-height: 1.6; outline: none; font-family: inherit;
      &:focus { border-color: #6366f1; }
    }
    .placeholder { display: flex; align-items: center; justify-content: center; height: 100%; color: #9ca3af; }
  `]
})
export class NoteEditorComponent implements OnChanges {
  @Input() note: Note | null = null;
  @Input() availableTags: Tag[] = [];
  @Output() saved = new EventEmitter<Note>();
  @Output() deleted = new EventEmitter<string>();

  title = '';
  content = '';
  selectedTagIds: string[] = [];

  constructor(private noteService: NoteService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['note'] && this.note) {
      this.title = this.note.title;
      this.content = this.note.content;
      this.selectedTagIds = this.note.tags.map(t => t._id);
    }
  }

  isTagActive(id: string) {
    return this.selectedTagIds.includes(id);
  }

  toggleTag(id: string) {
    if (this.isTagActive(id)) {
      this.selectedTagIds = this.selectedTagIds.filter(t => t !== id);
    } else {
      this.selectedTagIds.push(id);
    }
    this.save();
  }

  togglePin() {
    if (!this.note) return;
    this.noteService.updateNote(this.note._id, { isPinned: !this.note.isPinned }).subscribe(n => this.saved.emit(n));
  }

  save() {
    if (!this.note || !this.title.trim()) return;
    this.noteService.updateNote(this.note._id, {
      title: this.title,
      content: this.content,
      tags: this.selectedTagIds,
    }).subscribe(n => this.saved.emit(n));
  }

  deleteNote() {
    if (!this.note) return;
    this.noteService.deleteNote(this.note._id).subscribe(() => this.deleted.emit(this.note!._id));
  }
}

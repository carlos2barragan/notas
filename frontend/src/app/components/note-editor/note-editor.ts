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
      <div class="editor-topbar">
        <div class="meta">
          <span class="last-saved">{{ note.updatedAt | date:'d MMM y · HH:mm' }}</span>
        </div>
        <div class="actions">
          <button class="action-btn pin-btn" (click)="togglePin()" [class.active]="note.isPinned" title="Anclar nota">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 2v9m-4 0l4 7 4-7M6 11H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="action-btn delete-btn" (click)="deleteNote()" title="Eliminar nota">
            <svg viewBox="0 0 20 20" fill="none"><path d="M5 6h10M8 6V4h4v2M9 10v5M11 10v5M6 6l.7 10.3A1 1 0 007.7 17h4.6a1 1 0 001-.7L14 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>

      <div class="editor-body">
        <input
          [(ngModel)]="title"
          class="title-input"
          placeholder="Título"
          (blur)="save()"
        />

        <div class="tags-row" *ngIf="availableTags.length > 0">
          <span
            *ngFor="let tag of availableTags"
            class="tag-pill"
            [class.active]="isTagActive(tag._id)"
            [style.--tag-color]="tag.color"
            (click)="toggleTag(tag._id)"
          >
            <span class="dot" [style.background]="isTagActive(tag._id) ? tag.color : 'var(--text-muted)'"></span>
            {{ tag.name }}
          </span>
        </div>

        <div class="divider"></div>

        <textarea
          [(ngModel)]="content"
          class="content-area"
          placeholder="Empieza a escribir..."
          (blur)="save()"
        ></textarea>
      </div>
    </div>

    <ng-template #placeholder>
      <div class="placeholder">
        <div class="placeholder-icon">✦</div>
        <h2>Selecciona una nota</h2>
        <p>O crea una nueva desde el panel izquierdo</p>
      </div>
    </ng-template>
  `,
  styles: [`
    :host {
      display: flex;
      height: 100%;
    }

    .editor {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }

    .editor-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      border-bottom: 1px solid var(--border);
      background: var(--surface);
    }

    .meta .last-saved {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .actions {
      display: flex;
      gap: 0.4rem;
    }

    .action-btn {
      width: 34px;
      height: 34px;
      border: 1px solid var(--border);
      background: var(--surface-2);
      border-radius: 9px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.18s ease;
      color: var(--text-secondary);

      svg {
        width: 16px;
        height: 16px;
      }

      &:hover {
        border-color: var(--border-hover);
        background: var(--surface-3);
        color: var(--text-primary);
      }

      &.pin-btn.active {
        border-color: rgba(139, 92, 246, 0.5);
        background: rgba(139, 92, 246, 0.12);
        color: var(--accent);
      }

      &.delete-btn:hover {
        border-color: rgba(248, 113, 113, 0.4);
        background: var(--red-bg);
        color: var(--red);
      }
    }

    .editor-body {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 2rem 2.5rem;
      overflow-y: auto;
      gap: 1rem;
    }

    .title-input {
      font-size: 2rem;
      font-weight: 700;
      font-family: inherit;
      color: var(--text-primary);
      background: transparent;
      border: none;
      outline: none;
      letter-spacing: -0.03em;
      line-height: 1.2;
      width: 100%;

      &::placeholder { color: var(--text-muted); }
    }

    .tags-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .tag-pill {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.25rem 0.65rem;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--surface-2);
      cursor: pointer;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-muted);
      transition: all 0.18s ease;
      user-select: none;

      &:hover {
        color: var(--text-secondary);
        border-color: rgba(255,255,255,0.1);
      }

      &.active {
        background: color-mix(in srgb, var(--tag-color) 15%, transparent);
        border-color: color-mix(in srgb, var(--tag-color) 50%, transparent);
        color: var(--tag-color);
      }

      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        flex-shrink: 0;
        transition: background 0.18s;
      }
    }

    .divider {
      height: 1px;
      background: var(--border);
    }

    .content-area {
      flex: 1;
      min-height: 300px;
      resize: none;
      background: transparent;
      border: none;
      outline: none;
      font-size: 0.95rem;
      font-family: inherit;
      font-weight: 400;
      color: var(--text-secondary);
      line-height: 1.8;

      &::placeholder { color: var(--text-muted); }
    }

    .placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      gap: 0.6rem;
      text-align: center;

      .placeholder-icon {
        font-size: 2.5rem;
        background: linear-gradient(135deg, var(--accent), var(--accent-2));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.5rem;
      }

      h2 {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-secondary);
        letter-spacing: -0.02em;
      }

      p {
        font-size: 0.82rem;
        color: var(--text-muted);
      }
    }
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

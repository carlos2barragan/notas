import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="note-list">
      <div *ngIf="notes.length === 0" class="empty">
        <div class="empty-icon">✦</div>
        <p>Sin notas aún</p>
        <span>Crea una nueva nota para empezar</span>
      </div>
      <div
        *ngFor="let note of notes"
        class="note-card"
        [class.selected]="selectedId === note._id"
        (click)="select.emit(note)"
      >
        <div class="note-top">
          <span class="title">{{ note.title }}</span>
          <span class="pin" *ngIf="note.isPinned">⬡</span>
        </div>
        <p class="preview">{{ note.content | slice:0:90 }}{{ note.content.length > 90 ? '…' : '' }}</p>
        <div class="note-footer">
          <div class="note-tags">
            <span
              *ngFor="let tag of note.tags.slice(0, 2)"
              class="tag"
              [style.--tag-color]="tag.color"
            >{{ tag.name }}</span>
            <span class="tag-more" *ngIf="note.tags.length > 2">+{{ note.tags.length - 2 }}</span>
          </div>
          <span class="date">{{ note.updatedAt | date:'d MMM' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .note-list {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      padding-top: 0.25rem;
    }

    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem 1rem;
      gap: 0.4rem;
      text-align: center;

      .empty-icon {
        font-size: 1.8rem;
        background: linear-gradient(135deg, var(--accent), var(--accent-2));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.25rem;
      }

      p {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-secondary);
      }

      span {
        font-size: 0.78rem;
        color: var(--text-muted);
      }
    }

    .note-card {
      padding: 0.8rem 0.9rem;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: var(--surface-2);
      cursor: pointer;
      transition: all 0.18s ease;

      &:hover {
        border-color: rgba(139, 92, 246, 0.25);
        background: var(--surface-3);
        transform: translateX(2px);
      }

      &.selected {
        border-color: rgba(139, 92, 246, 0.5);
        background: rgba(139, 92, 246, 0.08);
        box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.15);
      }
    }

    .note-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.3rem;
    }

    .title {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--text-primary);
      line-height: 1.3;
      flex: 1;
    }

    .pin {
      font-size: 0.8rem;
      color: var(--accent);
      flex-shrink: 0;
      margin-top: 1px;
    }

    .preview {
      font-size: 0.78rem;
      color: var(--text-secondary);
      line-height: 1.5;
      margin-bottom: 0.55rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .note-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .note-tags {
      display: flex;
      gap: 0.3rem;
      flex-wrap: wrap;
    }

    .tag {
      padding: 0.1rem 0.5rem;
      border-radius: 999px;
      font-size: 0.68rem;
      font-weight: 500;
      background: color-mix(in srgb, var(--tag-color) 12%, transparent);
      color: var(--tag-color);
      border: 1px solid color-mix(in srgb, var(--tag-color) 30%, transparent);
    }

    .tag-more {
      padding: 0.1rem 0.5rem;
      border-radius: 999px;
      font-size: 0.68rem;
      font-weight: 500;
      background: var(--surface-3);
      color: var(--text-muted);
    }

    .date {
      font-size: 0.7rem;
      color: var(--text-muted);
      white-space: nowrap;
    }
  `]
})
export class NoteListComponent {
  @Input() notes: Note[] = [];
  @Input() selectedId: string | null = null;
  @Output() select = new EventEmitter<Note>();
}

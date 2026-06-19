import {
  Component, ElementRef, EventEmitter, HostListener, Input,
  OnChanges, Output, SimpleChanges, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note, MediaItem } from '../../models/note.model';
import { Tag } from '../../models/tag.model';
import { NoteService } from '../../services/note.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="editor"
      *ngIf="note; else placeholder"
      [class.drag-over]="isDragging"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave()"
      (drop)="onDrop($event)"
    >
      <!-- Topbar -->
      <div class="editor-topbar">
        <span class="last-saved">{{ note.updatedAt | date:'d MMM y · HH:mm' }}</span>
        <div class="actions">
          <button class="action-btn" (click)="fileInput.click()" title="Adjuntar imagen o video">
            <svg viewBox="0 0 20 20" fill="none">
              <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="7" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.5"/>
              <path d="M2 14l4-4 3 3 3-3 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="action-btn" (click)="videoInput.click()" title="Adjuntar video">
            <svg viewBox="0 0 20 20" fill="none">
              <rect x="2" y="5" width="11" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M13 8.5l5-2.5v7l-5-2.5V8.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="action-btn pin-btn" [class.active]="note.isPinned" (click)="togglePin()" title="Anclar nota">
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M10 2v9m-4 0l4 7 4-7M6 11H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="action-btn delete-btn" (click)="deleteNote()" title="Eliminar nota">
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M5 6h10M8 6V4h4v2M9 10v5M11 10v5M6 6l.7 10.3A1 1 0 007.7 17h4.6a1 1 0 001-.7L14 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Inputs ocultos -->
      <input #fileInput type="file" accept="image/*" multiple hidden (change)="onFilePicked($event)" />
      <input #videoInput type="file" accept="video/mp4,video/webm,video/quicktime" multiple hidden (change)="onFilePicked($event)" />

      <!-- Body -->
      <div class="editor-body">
        <input [(ngModel)]="title" class="title-input" placeholder="Título" (blur)="save()" />

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

        <!-- Upload progress -->
        <div class="upload-progress" *ngIf="uploading">
          <div class="spinner"></div>
          <span>Subiendo archivo...</span>
        </div>

        <!-- Media gallery -->
        <div class="media-gallery" *ngIf="media.length > 0">
          <div class="gallery-label">
            <svg viewBox="0 0 16 16" fill="none">
              <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
              <circle cx="5.5" cy="7" r="1.5" fill="currentColor" opacity=".5"/>
              <path d="M1 11l3.5-3.5 2.5 2.5 2.5-2.5L13 11" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Archivos adjuntos ({{ media.length }})
          </div>
          <div class="gallery-grid">
            <div class="media-item" *ngFor="let item of media; let i = index">

              <ng-container *ngIf="item.type === 'image'">
                <img
                  [src]="item.url"
                  [alt]="item.name"
                  class="media-img"
                  (click)="openLightbox(item)"
                />
              </ng-container>

              <ng-container *ngIf="item.type === 'video'">
                <video class="media-video" controls [src]="item.url" preload="metadata"></video>
              </ng-container>

              <button class="remove-media" (click)="removeMedia(i)" title="Eliminar">
                <svg viewBox="0 0 12 12" fill="none">
                  <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
              <div class="media-name">{{ item.name }}</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Drag overlay -->
      <div class="drag-overlay" *ngIf="isDragging">
        <div class="drag-message">
          <svg viewBox="0 0 40 40" fill="none">
            <path d="M20 8v16M12 16l8-8 8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 30h28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Suelta para adjuntar</span>
        </div>
      </div>

      <!-- Lightbox -->
      <div class="lightbox" *ngIf="lightboxItem" (click)="closeLightbox()">
        <button class="lightbox-close" (click)="closeLightbox()">
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
        <img [src]="lightboxItem.url" [alt]="lightboxItem.name" (click)="$event.stopPropagation()" />
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
    :host { display: flex; height: 100%; }

    .editor {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      position: relative;
      transition: background 0.2s;

      &.drag-over .editor-body { opacity: 0.3; pointer-events: none; }
    }

    /* ── Topbar ── */
    .editor-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.9rem 2rem;
      border-bottom: 1px solid var(--border);
      background: var(--surface);
      flex-shrink: 0;
    }

    .last-saved { font-size: 0.75rem; color: var(--text-muted); }

    .actions { display: flex; gap: 0.4rem; }

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

      svg { width: 16px; height: 16px; }

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

    /* ── Body ── */
    .editor-body {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 2rem 2.5rem;
      overflow-y: auto;
      gap: 1rem;
      transition: opacity 0.2s;
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

    .tags-row { display: flex; flex-wrap: wrap; gap: 0.4rem; }

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

      &:hover { color: var(--text-secondary); border-color: rgba(255,255,255,0.1); }

      &.active {
        background: color-mix(in srgb, var(--tag-color) 15%, transparent);
        border-color: color-mix(in srgb, var(--tag-color) 50%, transparent);
        color: var(--tag-color);
      }

      .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; transition: background 0.18s; }
    }

    .divider { height: 1px; background: var(--border); flex-shrink: 0; }

    .content-area {
      min-height: 160px;
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

    /* ── Upload progress ── */
    .upload-progress {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.75rem 1rem;
      background: rgba(139, 92, 246, 0.08);
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 10px;
      font-size: 0.82rem;
      color: var(--accent);
    }

    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(139, 92, 246, 0.3);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      flex-shrink: 0;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Media gallery ── */
    .media-gallery {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .gallery-label {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.72rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: var(--text-muted);

      svg { width: 14px; height: 14px; }
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 0.75rem;
    }

    .media-item {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border);
      background: var(--surface-2);
      group: true;

      &:hover .remove-media { opacity: 1; }
      &:hover .media-name { opacity: 1; }
    }

    .media-img {
      width: 100%;
      aspect-ratio: 4/3;
      object-fit: cover;
      display: block;
      cursor: zoom-in;
      transition: transform 0.25s ease;

      &:hover { transform: scale(1.03); }
    }

    .media-video {
      width: 100%;
      display: block;
      border-radius: 0;
      max-height: 220px;
      background: #000;
    }

    .remove-media {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 24px;
      height: 24px;
      background: rgba(0, 0, 0, 0.7);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.18s, background 0.18s;
      color: #fff;

      svg { width: 10px; height: 10px; }
      &:hover { background: rgba(248, 113, 113, 0.85); }
    }

    .media-name {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0.3rem 0.5rem;
      background: linear-gradient(transparent, rgba(0,0,0,0.7));
      font-size: 0.68rem;
      color: rgba(255,255,255,0.8);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      opacity: 0;
      transition: opacity 0.18s;
    }

    /* ── Drag overlay ── */
    .drag-overlay {
      position: absolute;
      inset: 0;
      background: rgba(139, 92, 246, 0.08);
      border: 2px dashed rgba(139, 92, 246, 0.5);
      border-radius: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      pointer-events: none;
    }

    .drag-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      color: var(--accent);

      svg { width: 40px; height: 40px; }

      span {
        font-size: 1rem;
        font-weight: 600;
        letter-spacing: -0.01em;
      }
    }

    /* ── Lightbox ── */
    .lightbox {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.92);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 2rem;
      cursor: zoom-out;

      img {
        max-width: 90vw;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
        cursor: default;
        box-shadow: 0 0 80px rgba(0,0,0,0.8);
      }
    }

    .lightbox-close {
      position: fixed;
      top: 1.25rem;
      right: 1.25rem;
      width: 36px;
      height: 36px;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      transition: background 0.18s;

      svg { width: 16px; height: 16px; }
      &:hover { background: rgba(255,255,255,0.2); }
    }

    /* ── Placeholder ── */
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

      p { font-size: 0.82rem; color: var(--text-muted); }
    }
  `]
})
export class NoteEditorComponent implements OnChanges {
  @Input() note: Note | null = null;
  @Input() availableTags: Tag[] = [];
  @Output() saved = new EventEmitter<Note>();
  @Output() deleted = new EventEmitter<string>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('videoInput') videoInput!: ElementRef<HTMLInputElement>;

  title = '';
  content = '';
  selectedTagIds: string[] = [];
  media: MediaItem[] = [];
  uploading = false;
  isDragging = false;
  lightboxItem: MediaItem | null = null;

  constructor(
    private noteService: NoteService,
    private uploadService: UploadService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['note'] && this.note) {
      this.title = this.note.title;
      this.content = this.note.content;
      this.selectedTagIds = this.note.tags.map(t => t._id);
      this.media = [...(this.note.media ?? [])];
    }
  }

  isTagActive(id: string) { return this.selectedTagIds.includes(id); }

  toggleTag(id: string) {
    this.selectedTagIds = this.isTagActive(id)
      ? this.selectedTagIds.filter(t => t !== id)
      : [...this.selectedTagIds, id];
    this.save();
  }

  togglePin() {
    if (!this.note) return;
    this.noteService.updateNote(this.note._id, { isPinned: !this.note.isPinned })
      .subscribe(n => this.saved.emit(n));
  }

  save() {
    if (!this.note || !this.title.trim()) return;
    this.noteService.updateNote(this.note._id, {
      title: this.title,
      content: this.content,
      tags: this.selectedTagIds,
      media: this.media,
    }).subscribe(n => this.saved.emit(n));
  }

  deleteNote() {
    if (!this.note) return;
    this.noteService.deleteNote(this.note._id).subscribe(() => this.deleted.emit(this.note!._id));
  }

  @HostListener('window:paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    if (!this.note) return;
    const files = Array.from(event.clipboardData?.items ?? [])
      .filter(item => item.kind === 'file' && /^(image|video)\//.test(item.type))
      .map(item => item.getAsFile())
      .filter((f): f is File => f !== null);
    if (files.length) {
      event.preventDefault();
      this.uploadFiles(files);
    }
  }

  onFilePicked(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) this.uploadFiles(Array.from(files));
    (event.target as HTMLInputElement).value = '';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave() { this.isDragging = false; }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = Array.from(event.dataTransfer?.files ?? []).filter(f =>
      /^(image|video)\//.test(f.type)
    );
    if (files.length) this.uploadFiles(files);
  }

  private uploadFiles(files: File[]) {
    this.uploading = true;
    let pending = files.length;

    files.forEach(file => {
      this.uploadService.upload(file).subscribe({
        next: item => {
          this.media = [...this.media, item];
          pending--;
          if (pending === 0) { this.uploading = false; this.save(); }
        },
        error: () => {
          pending--;
          if (pending === 0) this.uploading = false;
        },
      });
    });
  }

  removeMedia(index: number) {
    this.media = this.media.filter((_, i) => i !== index);
    this.save();
  }

  openLightbox(item: MediaItem) { this.lightboxItem = item; }
  closeLightbox() { this.lightboxItem = null; }
}

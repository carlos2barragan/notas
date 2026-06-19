import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tag } from '../../models/tag.model';
import { TagService } from '../../services/tag.service';

@Component({
  selector: 'app-tag-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tag-manager">
      <p class="section-label">Etiquetas</p>
      <div class="tags-list">
        <button
          *ngFor="let tag of tags"
          class="tag-chip"
          [class.active]="activeTag === tag._id"
          [style.--tag-color]="tag.color"
          (click)="selectTag(tag._id)"
        >
          <span class="dot" [style.background]="tag.color"></span>
          {{ tag.name }}
        </button>
        <button class="tag-chip clear" *ngIf="activeTag" (click)="selectTag(null)">
          × Todas
        </button>
      </div>
      <div class="new-tag">
        <input [(ngModel)]="newTagName" placeholder="Nueva etiqueta..." class="tag-input" (keydown.enter)="addTag()" />
        <label class="color-wrap" [style.background]="newTagColor">
          <input type="color" [(ngModel)]="newTagColor" class="color-picker" />
        </label>
        <button class="add-btn" (click)="addTag()" [disabled]="!newTagName.trim()">+</button>
      </div>
    </div>
  `,
  styles: [`
    .tag-manager { padding: 0.75rem 0; border-bottom: 1px solid var(--border); margin-bottom: 0.5rem; }

    .section-label {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      margin-bottom: 0.6rem;
    }

    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-bottom: 0.75rem;
    }

    .tag-chip {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.25rem 0.65rem;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--surface-2);
      cursor: pointer;
      font-size: 0.75rem;
      font-family: inherit;
      font-weight: 500;
      color: var(--text-secondary);
      transition: all 0.18s ease;

      &:hover {
        border-color: var(--border-hover);
        color: var(--text-primary);
        background: var(--surface-3);
      }

      &.active {
        background: color-mix(in srgb, var(--tag-color) 15%, transparent);
        border-color: var(--tag-color);
        color: var(--tag-color);
      }

      &.clear {
        border-color: rgba(248, 113, 113, 0.3);
        color: var(--red);
        background: var(--red-bg);
      }
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .new-tag {
      display: flex;
      gap: 0.4rem;
      align-items: center;
    }

    .tag-input {
      flex: 1;
      padding: 0.4rem 0.65rem;
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 0.8rem;
      font-family: inherit;
      color: var(--text-primary);
      outline: none;
      transition: all 0.2s;

      &::placeholder { color: var(--text-muted); }
      &:focus { border-color: var(--border-hover); background: var(--surface-3); }
    }

    .color-wrap {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
      border: 2px solid rgba(255,255,255,0.15);
    }

    .color-picker {
      width: 40px;
      height: 40px;
      opacity: 0;
      cursor: pointer;
    }

    .add-btn {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      color: #fff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1.1rem;
      font-family: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;

      &:hover { transform: scale(1.08); }
      &:disabled { opacity: 0.35; cursor: default; transform: none; }
    }
  `]
})
export class TagManagerComponent implements OnInit {
  @Input() tags: Tag[] = [];
  @Output() tagSelected = new EventEmitter<string | null>();
  @Output() tagsChanged = new EventEmitter<void>();

  activeTag: string | null = null;
  newTagName = '';
  newTagColor = '#8b5cf6';

  constructor(private tagService: TagService) {}

  ngOnInit() {}

  selectTag(id: string | null) {
    this.activeTag = id;
    this.tagSelected.emit(id);
  }

  addTag() {
    if (!this.newTagName.trim()) return;
    this.tagService.createTag({ name: this.newTagName.trim(), color: this.newTagColor }).subscribe(() => {
      this.newTagName = '';
      this.tagsChanged.emit();
    });
  }
}

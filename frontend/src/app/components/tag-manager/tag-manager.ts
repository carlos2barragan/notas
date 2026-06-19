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
      <h3>Etiquetas</h3>
      <div class="tags-list">
        <button
          *ngFor="let tag of tags"
          class="tag-chip"
          [class.active]="activeTag === tag._id"
          [style.background-color]="activeTag === tag._id ? tag.color : ''"
          [style.border-color]="tag.color"
          [style.color]="activeTag === tag._id ? '#fff' : tag.color"
          (click)="selectTag(tag._id)"
        >
          {{ tag.name }}
        </button>
        <button class="tag-chip clear" *ngIf="activeTag" (click)="selectTag(null)">
          × Limpiar
        </button>
      </div>
      <div class="new-tag">
        <input [(ngModel)]="newTagName" placeholder="Nueva etiqueta" class="tag-input" />
        <input type="color" [(ngModel)]="newTagColor" class="color-picker" />
        <button (click)="addTag()" [disabled]="!newTagName.trim()">+</button>
      </div>
    </div>
  `,
  styles: [`
    .tag-manager { padding: 1rem 0; }
    h3 { font-size: 0.85rem; text-transform: uppercase; color: #6b7280; margin-bottom: 0.5rem; }
    .tags-list { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.75rem; }
    .tag-chip {
      padding: 0.2rem 0.7rem; border-radius: 999px; border: 1.5px solid #d1d5db;
      background: #fff; cursor: pointer; font-size: 0.8rem; transition: all 0.15s;
      &.clear { border-color: #ef4444; color: #ef4444; }
    }
    .new-tag { display: flex; gap: 0.4rem; align-items: center; }
    .tag-input { flex: 1; padding: 0.3rem 0.6rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.85rem; }
    .color-picker { width: 32px; height: 32px; border: none; cursor: pointer; border-radius: 4px; padding: 0; }
    button:not(.tag-chip) {
      padding: 0.3rem 0.7rem; background: #6366f1; color: #fff;
      border: none; border-radius: 6px; cursor: pointer; font-size: 1rem;
      &:disabled { opacity: 0.5; cursor: default; }
    }
  `]
})
export class TagManagerComponent implements OnInit {
  @Input() tags: Tag[] = [];
  @Output() tagSelected = new EventEmitter<string | null>();
  @Output() tagsChanged = new EventEmitter<void>();

  activeTag: string | null = null;
  newTagName = '';
  newTagColor = '#6366f1';

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

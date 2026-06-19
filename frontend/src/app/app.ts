import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from './models/note.model';
import { Tag } from './models/tag.model';
import { NoteService } from './services/note.service';
import { TagService } from './services/tag.service';
import { NoteListComponent } from './components/note-list/note-list';
import { NoteEditorComponent } from './components/note-editor/note-editor';
import { TagManagerComponent } from './components/tag-manager/tag-manager';
import { SearchBarComponent } from './components/search-bar/search-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NoteListComponent, NoteEditorComponent, TagManagerComponent, SearchBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  notes: Note[] = [];
  tags: Tag[] = [];
  selectedNote: Note | null = null;
  private searchQuery = '';
  private activeTag: string | null = null;

  constructor(private noteService: NoteService, private tagService: TagService) {}

  ngOnInit() {
    this.loadNotes();
    this.loadTags();
  }

  loadNotes() {
    this.noteService.getNotes(this.searchQuery || undefined, this.activeTag || undefined)
      .subscribe(notes => this.notes = notes);
  }

  loadTags() {
    this.tagService.getTags().subscribe(tags => this.tags = tags);
  }

  createNote() {
    this.noteService.createNote({ title: 'Nueva nota', content: '' }).subscribe(note => {
      this.notes = [note, ...this.notes];
      this.selectedNote = note;
    });
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.loadNotes();
  }

  onTagFilter(tagId: string | null) {
    this.activeTag = tagId;
    this.loadNotes();
  }

  onNoteSaved(updated: Note) {
    this.notes = this.notes.map(n => n._id === updated._id ? updated : n);
    this.selectedNote = updated;
  }

  onNoteDeleted(id: string) {
    this.notes = this.notes.filter(n => n._id !== id);
    this.selectedNote = null;
  }
}

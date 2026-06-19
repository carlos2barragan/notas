import { Tag } from './tag.model';

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: Tag[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title: string;
  content?: string;
  tags?: string[];
  isPinned?: boolean;
}

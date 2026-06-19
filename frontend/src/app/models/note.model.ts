import { Tag } from './tag.model';

export interface MediaItem {
  url: string;
  type: 'image' | 'video' | 'audio';
  name: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: Tag[];
  media: MediaItem[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title: string;
  content?: string;
  tags?: string[];
  media?: MediaItem[];
  isPinned?: boolean;
}

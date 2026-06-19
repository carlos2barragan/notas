export interface Tag {
  _id: string;
  name: string;
  color: string;
}

export interface CreateTagDto {
  name: string;
  color?: string;
}

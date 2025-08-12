export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  status: 'draft' | 'in-progress' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

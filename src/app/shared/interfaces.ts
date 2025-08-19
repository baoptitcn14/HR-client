export interface Column {
  field: string;
  name: string;
  width?: number;
  styleClass?: string;
  filterMatchMode?: 'strict' | 'lenient';
}

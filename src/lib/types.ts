export type DocType = 'workflow' | 'tool' | 'skill' | 'resource'

export interface Document {
  id: string
  author_name: string
  title: string
  description: string
  type: DocType
  categories: string[]
  content: string
  link: string | null
  created_at: string
  updated_at: string
}

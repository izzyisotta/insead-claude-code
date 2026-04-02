export type DocType = 'workflow' | 'tool' | 'skill' | 'resource'

export interface Profile {
  id: string
  name: string
  email: string | null
  avatar_url: string | null
  created_at: string
}

export interface Document {
  id: string
  author_id: string
  title: string
  description: string
  type: DocType
  categories: string[]
  content: string
  link: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
}

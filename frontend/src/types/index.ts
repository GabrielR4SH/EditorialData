export interface User {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface Sector {
  id: number
  name: string
  slug: string
  description: string | null
  is_active: boolean
  researches_count?: number
  publications_count?: number
  created_at: string
  updated_at: string
}

export interface Research {
  id: number
  sector_id: number
  user_id: number
  title: string
  description: string | null
  status: 'draft' | 'in_progress' | 'completed' | 'archived'
  start_date: string | null
  end_date: string | null
  sector?: { id: number; name: string }
  user?: { id: number; name: string }
  created_at: string
  updated_at: string
}

export interface Publication {
  id: number
  sector_id: number
  title: string
  slug: string
  type: 'yearbook' | 'special_edition' | 'report' | 'bulletin'
  year: number | null
  summary: string | null
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
  sector?: { id: number; name: string }
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  token: string
}

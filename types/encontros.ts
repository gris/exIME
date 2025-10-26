export interface Topic {
  speaker: string
  talk_name: string
}

export interface Encontro {
  id: string
  date: string
  time: string
  topics: Topic[]
  created_at: string
  updated_at: string
}

export interface EncontroFormData {
  date: string
  time: string
  topics: Topic[]
}


import data from "../data.json"

export interface Service {
  index: string
  title: string
  copy: string
  deliverables: string[]
}

export interface Project {
  id: string
  kind: string
  title: string
  category: string
  description: string
  features: string[]
  url?: string
  image?: string
  imageAlt?: string
  preview?: {
    brand: string
    headline: string
    action: string
    background: string
    foreground: string
    accent: string
  }
}

interface SiteData {
  hero: { description: string }
  studio: {
    email: string
    whatsappNumber: string
    whatsappMessage: string
  }
  sections: {
    projects: boolean
  }
  services: Service[]
  projects: Project[]
  contact: {
    heading: string
    description: string
    subject: string
    emailBody: string
  }
}

export const siteData: SiteData = data

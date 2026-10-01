export enum EmploymentType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
}

export enum WorkMode {
  ON_SITE = 'on-site',
  REMOTE = 'remote',
}

export interface ExperienceClient {
  id: string
  name: string
  logo: string
  url: string
}

export interface ExperienceItem {
  id: string
  company: string
  logo: string
  url: string | null
  clients: ExperienceClient[]
  start: string
  end: string | null
  location: string | null
  employment: EmploymentType
  mode: WorkMode
  stack: string[]
}

export interface ProfileLink {
  id: string
  label: string
  handle: string
  href: string
  icon: string
}

export interface ProfileCv {
  lang: string
  label: string
  href: string
}

export interface ProfileStat {
  id: string
  value: number
  suffix: string
}

export interface CertificateIssuer {
  id: string
  logo: string
  url: string
}

export interface CertificateItem {
  id: string
  image: string
  issuers: CertificateIssuer[]
}

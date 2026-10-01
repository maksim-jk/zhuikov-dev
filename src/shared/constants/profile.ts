import { ICON_GITHUB, ICON_LINKEDIN, ICON_TELEGRAM } from './brand-icons'
import { EmploymentType, WorkMode } from './profile.types'

import type { CertificateItem, ExperienceItem, ProfileCv, ProfileLink, ProfileStat } from './profile.types'

export const PROFILE_EMAIL = 'sinplym1@gmail.com'

export const PROFILE_LINKEDIN = 'https://www.linkedin.com/in/maksim-zhuikov/'

export const PROFILE_GITHUB = 'https://github.com/Maksim-Jk'

export const PROFILE_TELEGRAM = 'https://t.me/maks_jk'

export const PROFILE_LINKS: ProfileLink[] = [
  { id: 'telegram', label: 'Telegram', handle: '@maks_jk', href: PROFILE_TELEGRAM, icon: ICON_TELEGRAM },
  { id: 'linkedin', label: 'LinkedIn', handle: 'in/maksim-zhuikov', href: PROFILE_LINKEDIN, icon: ICON_LINKEDIN },
  { id: 'github', label: 'GitHub', handle: '@Maksim-Jk', href: PROFILE_GITHUB, icon: ICON_GITHUB },
]

export const PROFILE_CV: ProfileCv[] = [
  { lang: 'ru', label: 'RU', href: '/CV_Zhuikov-Maksim_Frontend_ru.pdf' },
  { lang: 'en', label: 'EN', href: '/CV_Zhuikov-Maksim_Frontend_en.pdf' },
]

export const PROFILE_CERTIFICATES: CertificateItem[] = [
  {
    id: 'mentor',
    image: '/certificates/mentor.jpg',
    issuers: [
      { id: 'tech4impact', logo: '/logos/tech4impact.png', url: 'https://tech4impact.uz' },
    ],
  },
  {
    id: 'english',
    image: '/certificates/english.jpg',
    issuers: [
      { id: 'internation', logo: '/logos/internation.svg', url: 'https://inter-nation.uz' },
    ],
  },
]

export const PROFILE_STATS: ProfileStat[] = [
  { id: 'years', value: 4, suffix: '+' },
  { id: 'companies', value: 5, suffix: '' },
  { id: 'banks', value: 2, suffix: '' },
  { id: 'followers', value: 1100, suffix: '+' },
]

export const PROFILE_STACK: string[] = [
  'Vue 3',
  'Nuxt 3',
  'TypeScript',
  'React 18',
  'Pinia',
  'Redux Toolkit',
  'Zustand',
  'SCSS',
  'FSD',
  'Vite',
  'SSR / SSG',
  'i18n',
  'WCAG',
  'Lighthouse',
  'Jest',
  'Node.js',
  'PostgreSQL',
  'GitLab CI',
]

export const PROFILE_EXPERIENCE: ExperienceItem[] = [
  {
    id: 'uzum',
    company: 'Uzum',
    logo: '/logos/uzum.svg',
    url: 'https://uzum.com',
    clients: [{ id: 'kapitalbank', name: 'Kapitalbank', logo: '/logos/kapitalbank.svg', url: 'https://new.kapitalbank.uz' }],
    start: '2025-02',
    end: null,
    location: 'Tashkent',
    employment: EmploymentType.FULL_TIME,
    mode: WorkMode.ON_SITE,
    stack: ['Vue 3', 'TypeScript', 'Uzum UI', 'SWIFT', 'GitLab'],
  },
  {
    id: 'expera',
    company: 'Expera',
    logo: '/logos/expera.svg',
    url: 'https://expera.uz',
    clients: [{ id: 'nbu', name: 'NBU', logo: '/logos/nbu.png', url: 'https://nbu.uz' }],
    start: '2024-10',
    end: '2025-02',
    location: 'Tashkent',
    employment: EmploymentType.FULL_TIME,
    mode: WorkMode.ON_SITE,
    stack: ['Vue 3', 'Vue 2', 'FSD', 'API Gateway'],
  },
  {
    id: 'ax-technology',
    company: 'AX TECHNOLOGY',
    logo: '/logos/ax-technology.svg',
    url: 'https://www.axcapital.ae',
    clients: [{ id: 'axdesign', name: 'AX Design', logo: '/logos/axdesign.svg', url: 'https://axdesign.ae' }],
    start: '2024-05',
    end: '2024-10',
    location: 'Tashkent',
    employment: EmploymentType.FULL_TIME,
    mode: WorkMode.ON_SITE,
    stack: ['Nuxt 3', 'Vue 3', 'TypeScript', 'SCSS', 'schema.org', 'i18n'],
  },
  {
    id: 'treeweb',
    company: 'TREEWEB',
    logo: '/logos/treeweb.svg',
    url: 'https://tree-web.ru',
    clients: [
      { id: 'rir', name: 'Росатом ИР', logo: '/logos/rir.png', url: 'https://www.rusatom-utilities.ru' },
      { id: 'fgisopvk', name: 'ФГИС ОПВК', logo: '/logos/fgisopvk.png', url: 'https://fgisopvk.ru' },
      { id: 'kristall', name: 'Кристалл Мечты', logo: '/logos/kristall.svg', url: 'https://www.kristallgold.ru' },
      { id: 'rosfeo', name: 'ФЭО', logo: '/logos/rosfeo.png', url: 'https://rosfeo.ru' },
    ],
    start: '2023-11',
    end: '2024-10',
    location: null,
    employment: EmploymentType.PART_TIME,
    mode: WorkMode.REMOTE,
    stack: ['React 18', 'TypeScript', 'RTK Query', 'Zustand', 'MUI', 'Bitrix'],
  },
  {
    id: 'tomiris',
    company: 'Tomiris',
    logo: '/logos/tomiris.svg',
    url: null,
    clients: [],
    start: '2022-08',
    end: '2024-10',
    location: 'Astana',
    employment: EmploymentType.PART_TIME,
    mode: WorkMode.ON_SITE,
    stack: ['React', 'Vue 3', 'Webpack', 'Jest', 'Node.js', 'PostgreSQL', 'MongoDB'],
  },
]

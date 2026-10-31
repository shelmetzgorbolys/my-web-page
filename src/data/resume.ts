export interface ContactLink {
  label: string
  value: string
  href: string
}

export interface StackGroup {
  title: string
  items: string[]
}

export interface Achievement {
  title: string
  text: string
}

export interface EducationItem {
  degree: string
  place: string
  period: string
}

export interface Resume {
  name: string
  role: string
  location: string
  tagline: string
  contacts: ContactLink[]
  stack: StackGroup[]
  achievements: Achievement[]
  about: string[]
  education: EducationItem[]
  extraEducation: EducationItem[]
}

export const resume: Resume = {
  name: 'Денис Кудухов',
  role: 'Junior Frontend-разработчик',
  location: 'Воронеж',
  tagline:
    'Пишу на Vue 3 и TypeScript. Верстаю адаптивные интерфейсы по Figma, интегрирую GraphQL и REST, работаю в FSD и микрофронтендах.',
  contacts: [
    {
      label: 'Email',
      value: 'kudukhovdenis@gmail.com',
      href: 'mailto:kudukhovdenis@gmail.com',
    },
    {
      label: 'Telegram',
      value: '@shelmetzgorbolys',
      href: 'https://t.me/shelmetzgorbolys',
    },
  ],
  stack: [
    { title: 'Языки и разметка', items: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3'] },
    { title: 'Фреймворк', items: ['Vue 3', 'Pinia'] },
    { title: 'Данные', items: ['GraphQL', 'REST'] },
    { title: 'Инструменты', items: ['Vite', 'npm', 'DevTools', 'GitLab', 'Docker', 'Figma'] },
    { title: 'Безопасность', items: ['XSS', 'CSRF'] },
  ],
  achievements: [
    {
      title: 'Задачи полного цикла',
      text: 'Самостоятельно вёл задачи от требований в Tracker до MR и merge в master.',
    },
    {
      title: 'Адаптивная вёрстка по Figma',
      text: 'Верстал адаптивные компоненты по макетам, переиспользуя существующие компоненты и stores.',
    },
    {
      title: 'Интеграция GraphQL',
      text: 'Подключал GraphQL-запросы с типизацией и обработкой состояний loading / error / empty.',
    },
    {
      title: 'FSD и микрофронтенды',
      text: 'Добавлял функциональность в архитектуре FSD и микрофронтендах без нарушения правил импортов.',
    },
  ],
  about: [
    'Я Денис, начинающий Frontend-разработчик.',
    'Считаю себя честным, открытым и ответственным. Хочу продолжать то, чему я заложил прочный фундамент. Убеждён, что с моим усердием, честолюбием и внимательностью я сумею вырасти в конкуретного специалиста.',
    'Ищу опыт в команде высококлассных специалистов, чтобы набить шишек, вынести ценные уроки и принести пользу.',
  ],
  education: [
    {
      degree: 'Магистр — экологическая безопасность в строительстве',
      place: 'ВГТУ',
      period: '2015 — 2017',
    },
    {
      degree: 'Бакалавр — тепло-, газоснабжение и вентиляция',
      place: 'Воронежский ГАСУ',
      period: '2011 — 2015',
    },
  ],
  extraEducation: [
    {
      degree: 'Переводчик в сфере профессиональной коммуникации (EN — RU)',
      place: 'ВГТУ',
      period: '2015 — 2017',
    },
    {
      degree: 'Web Development',
      place: 'freeCodeCamp',
      period: 'Онлайн',
    },
  ],
}

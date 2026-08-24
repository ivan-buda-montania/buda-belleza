/** Content types that carry the institutional layer of the site. */

export interface Stat {
  id: string;
  value: number;
  /** Rendered before the value, e.g. "+". */
  prefix?: string;
  /** Rendered after the value, e.g. "%" or "k". */
  suffix?: string;
  label: string;
  detail: string;
}

export interface ProcessStep {
  id: string;
  step: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  business: string;
  city: string;
  /** Unsplash id — resolve through `unsplashUrl` in `lib/images`. */
  avatarId: string;
  yearsAsClient: number;
}

export interface Branch {
  id: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  hours: string;
  /** Whether this location also serves as a regional distribution centre. */
  distributionCenter?: boolean;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

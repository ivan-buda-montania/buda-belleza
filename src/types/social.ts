export type SocialPlatform = 'whatsapp' | 'facebook' | 'instagram' | 'tiktok';

export interface SocialLink {
  id: SocialPlatform;
  label: string;
  handle: string;
  href: string;
}

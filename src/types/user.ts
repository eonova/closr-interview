export interface SocialLink {
  id: string;
  platform: 'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'website';
  url: string;
}

export interface UserProfile {
  customUrl: string; // Added this
  username: string;
  avatarUrl: string;
  backgroundUrl: string; // Added this
  about: string;
  socialLinks: SocialLink[];
  tags: string[]; // Added this
}

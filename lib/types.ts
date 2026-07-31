export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  coverImage: string;
  images: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  technologies: string[];
  isFeatured: boolean;
  order: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  galleryImages: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
  publishedAt: string | Date;
  readingTime: number;
  authorName: string;
  authorAvatar?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags: { tag: { id: string; name: string; slug: string } }[];
  allowComments: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  views: number;
  comments?: {
    id: string;
    name: string;
    content: string;
    createdAt: string | Date;
  }[];
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
}

export interface YoutubeVideoItem {
  id: string;
  title: string;
  youtubeId: string;
  description?: string | null;
  isPlaylist: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  images: {
    id: string;
    imageUrl: string;
    title?: string | null;
    caption?: string | null;
  }[];
}

export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  icon: string;
  isActive: boolean;
}

export interface SiteSettingsData {
  heroTitle: string;
  heroSubtitle: string;
  heroVideoUrl: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  mapEmbedUrl?: string | null;
}

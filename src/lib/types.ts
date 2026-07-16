export type ContentStatus = "draft" | "published" | "hidden";

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string | null;
  status: ContentStatus;
  cover_image_url: string | null;
  images: string[];
  results: string | null;
  order_index: number;
  date_label: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string | null;
  status: ContentStatus;
  cover_image_url: string | null;
  order_index: number;
  date_label: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type SuccessEntry = {
  id: string;
  project_slug: string | null;
  title: string;
  period_label: string | null;
  value_label: string;
  order_index: number;
  status: ContentStatus;
};

export type GalleryImage = {
  id: string;
  url: string;
  alt_text: string | null;
  category: string | null;
  year: string | null;
  order_index: number;
  status: ContentStatus;
};

export type MediaItem = {
  id: string;
  storage_path: string;
  url: string;
  alt_text: string | null;
  credit: string | null;
  created_at: string;
};

export type HomeHeroData = {
  headline: string;
  quote: string;
  intro_title: string;
  intro_text: string;
  hero_image_url: string | null;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photo_url: string | null;
};

export type VereinData = {
  founder_name: string;
  founder_role: string;
  founder_bio: string;
  founder_photo_url: string | null;
  founder_photo_note?: string | null;
  helpers: TeamMember[];
  goals_title: string;
  goals_text: string;
};

export type KontaktData = {
  name: string;
  strasse: string;
  ort: string;
  telefon: string | null;
  email: string;
  instagram_url: string | null;
  instagram_note?: string | null;
};

export type SpendenData = {
  title: string;
  text: string;
  amounts: number[];
  online_payment_ready: boolean;
  placeholder_note: string;
  hero_image_url: string | null;
};

export type ErfolgeIntroData = {
  kantone: string[];
  hero_image_url: string | null;
};

export type FooterData = {
  vereinsname: string;
  gruendungsjahr: number;
};

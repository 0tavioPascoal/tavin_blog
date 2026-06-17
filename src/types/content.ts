export type PostStatus = "draft" | "published" | "archived";

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  status: PostStatus;
  readingTimeMinutes: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PostListItem = Pick<
  Post,
  | "id"
  | "title"
  | "slug"
  | "excerpt"
  | "coverImageUrl"
  | "readingTimeMinutes"
  | "publishedAt"
>;

export type PortfolioProject = {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string | null;
  repositoryUrl: string | null;
  demoUrl: string | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};

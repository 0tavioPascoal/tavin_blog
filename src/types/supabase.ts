export type ArticleStatus = "draft" | "published";

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          content_markdown: string;
          published_at: string | null;
          updated_at: string;
          status: ArticleStatus;
          tags: string[];
          reading_time_minutes: number;
          is_featured: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          content_markdown: string;
          published_at?: string | null;
          updated_at?: string;
          status?: ArticleStatus;
          tags?: string[];
          reading_time_minutes?: number;
          is_featured?: boolean;
        };
        Update: {
          title?: string;
          slug?: string;
          description?: string;
          content_markdown?: string;
          published_at?: string | null;
          updated_at?: string;
          status?: ArticleStatus;
          tags?: string[];
          reading_time_minutes?: number;
          is_featured?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

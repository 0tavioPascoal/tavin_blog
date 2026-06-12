export type ArticleStatus = "draft" | "published";
export type ProjectStatus = "draft" | "published";

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          user_id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          email: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          category_id: string | null;
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
          category_id?: string | null;
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
          category_id?: string | null;
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
      article_tags: {
        Row: {
          article_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          article_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          article_id?: string;
          tag_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          content_markdown: string | null;
          repository_url: string | null;
          demo_url: string | null;
          cover_image_url: string | null;
          icon_name: string;
          status: ProjectStatus;
          tags: string[];
          is_featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          content_markdown?: string | null;
          repository_url?: string | null;
          demo_url?: string | null;
          cover_image_url?: string | null;
          icon_name?: string;
          status?: ProjectStatus;
          tags?: string[];
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          description?: string;
          content_markdown?: string | null;
          repository_url?: string | null;
          demo_url?: string | null;
          cover_image_url?: string | null;
          icon_name?: string;
          status?: ProjectStatus;
          tags?: string[];
          is_featured?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: boolean;
          site_url: string;
          contact_email: string;
          github_url: string | null;
          linkedin_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: boolean;
          site_url: string;
          contact_email: string;
          github_url?: string | null;
          linkedin_url?: string | null;
          updated_at?: string;
        };
        Update: {
          site_url?: string;
          contact_email?: string;
          github_url?: string | null;
          linkedin_url?: string | null;
          updated_at?: string;
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

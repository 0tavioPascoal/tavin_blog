export type ArticleStatus = "draft" | "published";
export type CertificateStatus = "draft" | "published";
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
      certificate_tags: {
        Row: {
          certificate_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          certificate_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          certificate_id?: string;
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
      certificates: {
        Row: {
          id: string;
          title: string;
          slug: string;
          issuer: string;
          description: string;
          credential_url: string | null;
          image_url: string | null;
          pdf_url: string | null;
          issued_at: string;
          expires_at: string | null;
          status: CertificateStatus;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          issuer: string;
          description: string;
          credential_url?: string | null;
          image_url?: string | null;
          pdf_url?: string | null;
          issued_at: string;
          expires_at?: string | null;
          status?: CertificateStatus;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          issuer?: string;
          description?: string;
          credential_url?: string | null;
          image_url?: string | null;
          pdf_url?: string | null;
          issued_at?: string;
          expires_at?: string | null;
          status?: CertificateStatus;
          sort_order?: number;
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
      project_tags: {
        Row: {
          project_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          project_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          project_id?: string;
          tag_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          color_hex: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          color_hex?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          color_hex?: string;
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
          resume_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: boolean;
          site_url: string;
          contact_email: string;
          github_url?: string | null;
          linkedin_url?: string | null;
          resume_url?: string | null;
          updated_at?: string;
        };
        Update: {
          site_url?: string;
          contact_email?: string;
          github_url?: string | null;
          linkedin_url?: string | null;
          resume_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      check_rate_limit: {
        Args: {
          p_scope: string;
          p_identifier: string;
          p_max_attempts: number;
          p_window_seconds: number;
        };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

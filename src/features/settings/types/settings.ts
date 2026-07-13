export type SiteSettings = {
  siteUrl: string;
  contactEmail: string;
  githubUrl: string | null;
  linkedinUrl: string | null;
  resumeUrl: string | null;
  updatedAt: string | null;
};

export type SiteSettingsMutationInput = {
  siteUrl: string;
  contactEmail: string;
  githubUrl: string | null;
  linkedinUrl: string | null;
};

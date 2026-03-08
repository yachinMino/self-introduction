export type Profile = {
  name: string;
  education: string;
  workExperience: string;
  certifications: string;
  selfPr: string;
  updatedAt: string;
};

export type ProfileInput = Omit<Profile, "updatedAt">;

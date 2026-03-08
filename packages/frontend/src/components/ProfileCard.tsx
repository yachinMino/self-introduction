import type { Profile } from "../types";

const sections: Array<{ key: keyof Omit<Profile, "name" | "updatedAt">; label: string }> = [
  { key: "education", label: "学歴" },
  { key: "workExperience", label: "職務経歴" },
  { key: "certifications", label: "資格" },
  { key: "selfPr", label: "自己PR" }
];

export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <section className="profile-card">
      <div className="nameplate">
        <span className="badge">PROFILE</span>
        <h2>{profile.name}</h2>
        <p className="updated-at">
          最終更新: {new Date(profile.updatedAt).toLocaleString("ja-JP")}
        </p>
      </div>

      <div className="profile-grid">
        {sections.map((section) => (
          <article className="profile-section" key={section.key}>
            <h3>{section.label}</h3>
            <p>{profile[section.key]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

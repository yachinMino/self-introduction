import type { ChangeEvent, FormEvent } from "react";
import type { ProfileInput } from "../types";

type Props = {
  value: ProfileInput;
  onChange: (nextValue: ProfileInput) => void;
  onSubmit: () => Promise<void>;
  isSaving: boolean;
};

const fields: Array<{
  key: keyof ProfileInput;
  label: string;
  placeholder: string;
}> = [
  { key: "name", label: "名前", placeholder: "山田 太郎" },
  {
    key: "education",
    label: "学歴",
    placeholder: "〇〇大学 △△学部 卒業"
  },
  {
    key: "workExperience",
    label: "職務経歴",
    placeholder: "2022年4月 - 現在 株式会社〇〇 フロントエンドエンジニア"
  },
  {
    key: "certifications",
    label: "資格",
    placeholder: "基本情報技術者 / TOEIC 850点"
  },
  {
    key: "selfPr",
    label: "自己PR",
    placeholder: "課題整理から実装まで一貫して進められます。"
  }
];

export function ProfileForm({ value, onChange, onSubmit, isSaving }: Props) {
  const handleFieldChange =
    (key: keyof ProfileInput) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange({
        ...value,
        [key]: event.target.value
      });
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit();
  };

  return (
    <form className="editor-form" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <label className="field" key={field.key}>
          <span>{field.label}</span>
          {field.key === "name" ? (
            <input
              required
              value={value[field.key]}
              onChange={handleFieldChange(field.key)}
              placeholder={field.placeholder}
            />
          ) : (
            <textarea
              required
              rows={field.key === "selfPr" ? 6 : 4}
              value={value[field.key]}
              onChange={handleFieldChange(field.key)}
              placeholder={field.placeholder}
            />
          )}
        </label>
      ))}

      <button className="primary-button" disabled={isSaving} type="submit">
        {isSaving ? "保存中..." : "保存する"}
      </button>
    </form>
  );
}

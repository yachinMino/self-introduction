import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearToken, fetchEditableProfile, updateEditableProfile } from "../api";
import { Layout } from "../components/Layout";
import { ProfileForm } from "../components/ProfileForm";
import type { ProfileInput } from "../types";

const emptyProfile: ProfileInput = {
  name: "",
  education: "",
  workExperience: "",
  certifications: "",
  selfPr: ""
};

export function EditPage() {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState<ProfileInput>(emptyProfile);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEditableProfile()
      .then((profile) => {
        setFormValue({
          name: profile.name,
          education: profile.education,
          workExperience: profile.workExperience,
          certifications: profile.certifications,
          selfPr: profile.selfPr
        });
      })
      .catch(() => {
        clearToken();
        navigate("/login");
      })
      .finally(() => setIsLoading(false));
  }, [navigate]);

  const helperText = useMemo(
    () => "公開ページに表示される内容をそのまま更新します。",
    []
  );

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      await updateEditableProfile(formValue);
      setMessage("保存しました。公開ページに反映されています。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <Layout
      title="プロフィール編集"
      subtitle="名前、学歴、職務経歴、資格、自己PR を管理できます。"
    >
      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="panel-kicker">EDITOR</p>
            <h2>編集フォーム</h2>
            <p className="panel-note">{helperText}</p>
          </div>
          <button className="secondary-button" onClick={handleLogout} type="button">
            ログアウト
          </button>
        </div>

        {isLoading ? <p className="status">読み込み中...</p> : null}
        {!isLoading ? (
          <>
            {message ? <p className="status success">{message}</p> : null}
            {error ? <p className="status error">{error}</p> : null}
            <ProfileForm
              value={formValue}
              onChange={setFormValue}
              onSubmit={handleSave}
              isSaving={isSaving}
            />
          </>
        ) : null}
      </section>
    </Layout>
  );
}

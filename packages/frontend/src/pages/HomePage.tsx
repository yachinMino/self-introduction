import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPublicProfile } from "../api";
import { Layout } from "../components/Layout";
import { ProfileCard } from "../components/ProfileCard";
import type { Profile } from "../types";

export function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPublicProfile()
      .then(setProfile)
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <Layout
      title="自己紹介サイト"
      subtitle="公開プロフィールと編集導線を分けた、単一ユーザー運用向けの構成です。"
    >
      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="panel-kicker">PUBLIC VIEW</p>
            <h2>プロフィール</h2>
          </div>
          <Link className="secondary-button" to="/login">
            編集ページへ
          </Link>
        </div>

        {error ? <p className="status error">{error}</p> : null}
        {!error && !profile ? <p className="status">読み込み中...</p> : null}
        {profile ? <ProfileCard profile={profile} /> : null}
      </section>
    </Layout>
  );
}

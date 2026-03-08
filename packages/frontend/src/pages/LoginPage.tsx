import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, setToken } from "../api";
import { Layout } from "../components/Layout";

export function LoginPage() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await login(loginId, password);
      setToken(response.token);
      navigate("/edit");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ログインに失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout
      title="編集ログイン"
      subtitle="ID とパスワードが一致した場合のみ編集ページに遷移します。"
    >
      <section className="panel narrow">
        <form className="editor-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>ID</span>
            <input
              required
              value={loginId}
              onChange={(event) => setLoginId(event.target.value)}
              placeholder="admin"
            />
          </label>

          <label className="field">
            <span>パスワード</span>
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="password"
            />
          </label>

          {error ? <p className="status error">{error}</p> : null}

          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? "認証中..." : "ログイン"}
          </button>
        </form>
      </section>
    </Layout>
  );
}

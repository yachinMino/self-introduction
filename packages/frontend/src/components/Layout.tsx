import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

export function Layout({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const location = useLocation();

  return (
    <div className="shell">
      <div className="backdrop backdrop-one" />
      <div className="backdrop backdrop-two" />
      <header className="hero">
        <div>
          <p className="eyebrow">SELF INTRODUCTION</p>
          <h1>{title}</h1>
          <p className="subtitle">{subtitle}</p>
        </div>
        <nav className="nav">
          <Link className={location.pathname === "/" ? "nav-link active" : "nav-link"} to="/">
            公開ページ
          </Link>
          <Link
            className={location.pathname === "/login" ? "nav-link active" : "nav-link"}
            to="/login"
          >
            編集ログイン
          </Link>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}

import "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className="main">
      <div className="nav">
        <Link href="#">NavElement1</Link>
        <Link href="#">NavElement2</Link>
        <Link href="#">NavElement3</Link>
      </div>
    </div>
  );
}
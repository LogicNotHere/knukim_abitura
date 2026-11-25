import Link from "next/link";

export default function NotFound() {
  return (
    <section style={{ maxWidth: 900, margin: "60px auto", padding: 24 }}>
      <p>Загубили напрям?</p>
      <h1>Тут поки порожньо.</h1>
      <p>Цієї демо-сторінки немає. Обери інший напрям.</p>
      <Link href="/">На головну →</Link>
    </section>
  );
}

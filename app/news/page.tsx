import { Suspense } from "react";
import { NewsPage } from "../../components/News";
import { getNews } from "../../lib/news";

export const metadata = { title: "Новини КНУКіМ" };
export const revalidate = 1800;

export default async function Page() {
  const news = await getNews();
  return <Suspense fallback={<p>Завантажуємо новини…</p>}><NewsPage news={news} /></Suspense>;
}

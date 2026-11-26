import { Home } from "../components/Screens";
import { getNews } from "../lib/news";

export const metadata = { title: "Твій творчий старт" };

export const revalidate = 1800;

export default async function Page() {
  const news = await getNews();
  return <Home news={news} />;
}

import { notFound } from "next/navigation";
import { DATA } from "../../../lib/data";
import { FacultyDetail } from "../../../components/Screens";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return DATA.faculties.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const item = DATA.faculties.find((entry) => entry.id === id);
  return { title: item?.name ?? "Сторінку не знайдено" };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const faculty = DATA.faculties.find((item) => item.id === id);
  if (!faculty) notFound();
  return <FacultyDetail faculty={faculty} />;
}

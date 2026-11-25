import { notFound } from "next/navigation";
import { DATA } from "../../../lib/data";
import { CourseDetail } from "../../../components/Screens";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return DATA.courses.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const item = DATA.courses.find((entry) => entry.id === id);
  return { title: item?.name ?? "Сторінку не знайдено" };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const course = DATA.courses.find((item) => item.id === id);
  if (!course) notFound();
  return <CourseDetail course={course} />;
}

import { notFound } from "next/navigation";
import { DATA } from "../../../lib/data";
import { DepartmentDetail } from "../../../components/Screens";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return DATA.departments.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const item = DATA.departments.find((entry) => entry.id === id);
  return { title: item?.name ?? "Сторінку не знайдено" };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const department = DATA.departments.find((item) => item.id === id);
  if (!department) notFound();
  return <DepartmentDetail department={department} />;
}

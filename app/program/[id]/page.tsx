import { notFound } from "next/navigation";
import { DATA } from "../../../lib/data";
import { ProgramDetail } from "../../../components/Screens";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return DATA.programs.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const item = DATA.programs.find((entry) => entry.id === id);
  return { title: item?.name ?? "Сторінку не знайдено" };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const program = DATA.programs.find((item) => item.id === id);
  if (!program) notFound();
  return <ProgramDetail program={program} />;
}

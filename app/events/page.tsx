import { Events } from "../../components/Screens";
import { Suspense } from "react";

export const metadata = { title: "Події для вступників" };

export default function Page() {
  return <Suspense fallback={<p>Завантажуємо календар…</p>}><Events /></Suspense>;
}

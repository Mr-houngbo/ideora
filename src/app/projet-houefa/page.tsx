import { verifySession } from "@/lib/dal";
import ProjetHouefaView from "@/components/pages/ProjetHouefaView";

export default async function ProjetHouefaPage() {
  await verifySession();
  return <ProjetHouefaView />;
}

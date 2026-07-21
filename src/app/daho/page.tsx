import { verifySession } from "@/lib/dal";
import DahoView from "@/components/pages/DahoView";

export default async function DahoPage() {
  await verifySession();
  return <DahoView />;
}

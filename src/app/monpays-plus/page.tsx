import { verifySession } from "@/lib/dal";
import MonPaysPlusView from "@/components/pages/MonPaysPlusView";

export default async function MonPaysPlusPage() {
  await verifySession();
  return <MonPaysPlusView />;
}

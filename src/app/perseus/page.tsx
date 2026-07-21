import { verifySession } from "@/lib/dal";
import PerseusView from "@/components/pages/PerseusView";

export default async function PerseusPage() {
  await verifySession();
  return <PerseusView />;
}

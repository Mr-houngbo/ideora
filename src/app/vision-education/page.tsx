import { verifySession } from "@/lib/dal";
import VisionEducationView from "@/components/pages/VisionEducationView";

export default async function VisionEducationPage() {
  await verifySession();
  return <VisionEducationView />;
}

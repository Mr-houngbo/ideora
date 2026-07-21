import { verifySession } from "@/lib/dal";
import AddProjectView from "@/components/pages/AddProjectView";

export default async function AddProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  await verifySession();
  const { category } = await searchParams;

  return <AddProjectView defaultCategory={category} />;
}

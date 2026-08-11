import GeneratedReportPage from "@/components/reports/GeneratedReportPage";

export default async function Page({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;

  return (
    <GeneratedReportPage reportId={reportId} />
  );
}
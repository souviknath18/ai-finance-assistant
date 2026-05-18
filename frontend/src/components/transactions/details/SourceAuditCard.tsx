import { ExternalLink, FileText } from "lucide-react";

export default function SourceAuditCard() {
  return (
    <div className="rounded-3xl border border-[#e5eeff] bg-white p-6 shadow-sm">
      <h3 className="mb-5 text-xs font-bold uppercase tracking-wide text-[#565e74]">
        Source & Audit Trail
      </h3>

      <div className="space-y-5">
        <div className="flex items-center justify-between rounded-2xl border border-[#c6c6cd] p-4 transition hover:bg-[#eff4ff]">
          <div className="flex items-center gap-4">
            <FileText size={22} className="text-black" />

            <div>
              <p className="text-sm font-bold text-black">
                Bank_Statement_Oct.pdf
              </p>

              <p className="text-xs text-[#565e74]">
                Uploaded via Bank Sync · Oct 25, 2024
              </p>
            </div>
          </div>

          <ExternalLink size={18} className="text-[#565e74]" />
        </div>

        <div className="rounded-2xl bg-[#eff4ff] p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#565e74]">
            Original Transaction String
          </p>

          <code className="rounded-lg bg-white px-3 py-2 text-sm text-black">
            CLDSCALE*AI_SUBSCRIPTION_OCT_2024
          </code>
        </div>
      </div>
    </div>
  );
}
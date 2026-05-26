import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import SubpageLayout, { SubpageCard } from "../components/layout/SubpageLayout";

export default function ChatPage() {
  return (
    <SubpageLayout
      badge={
        <>
          <MessageCircle size={12} />
          Chat
        </>
      }
      title="Finask Chat"
      subtitle="Real-time messaging is on the roadmap."
      maxWidth="md"
    >
      <SubpageCard className="py-12 text-center">
        <MessageCircle className="mx-auto mb-4 text-brand-blue" size={48} />
        <h2 className="mb-2 text-xl font-black text-slate-900 dark:text-white">
          Coming soon
        </h2>
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          Connect with students and advisors in a dedicated chat experience. Until
          then, use community Q&A on university, city, and program pages.
        </p>
        <Link
          to="/account?tab=help"
          className="inline-block rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white"
        >
          Help & support
        </Link>
      </SubpageCard>
    </SubpageLayout>
  );
}

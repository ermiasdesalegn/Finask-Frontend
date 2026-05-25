import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import {
  Loader2,
  MessageCircle,
  MessageSquare,
  Star,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SubpageLayout, {
  SignInGate,
  SubpageCard,
} from "../components/layout/SubpageLayout";
import { useAuth } from "../context/AuthContext";
import { useLoginModal } from "../context/LoginModalContext";
import { blurReveal } from "../lib/motion/pageMotion";
import {
  fetchMyAnsweredQuestions,
  fetchMyQuestions,
  fetchMyReviews,
} from "../lib/services/userService";
import { cn } from "../lib/utils";

type Tab = "reviews" | "questions" | "answers";

const TABS: {
  id: Tab;
  label: string;
  icon: typeof Star;
}[] = [
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "questions", label: "Questions", icon: MessageCircle },
  { id: "answers", label: "Answers", icon: MessageSquare },
];

export default function MePage() {
  const { isAuthenticated, user } = useAuth();
  const { openLogin } = useLoginModal();
  const [tab, setTab] = useState<Tab>("reviews");

  const reviewsQ = useQuery({
    queryKey: ["me", "reviews"],
    queryFn: fetchMyReviews,
    enabled: isAuthenticated,
  });
  const questionsQ = useQuery({
    queryKey: ["me", "questions"],
    queryFn: fetchMyQuestions,
    enabled: isAuthenticated,
  });
  const answersQ = useQuery({
    queryKey: ["me", "answers"],
    queryFn: fetchMyAnsweredQuestions,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 dark:bg-[#05060c]">
        <SignInGate
          title="My content"
          description="Sign in to see reviews, questions, and replies you've posted across FinAsk."
          onSignIn={openLogin}
        />
      </div>
    );
  }

  const loading =
    (tab === "reviews" && reviewsQ.isPending) ||
    (tab === "questions" && questionsQ.isPending) ||
    (tab === "answers" && answersQ.isPending);

  return (
    <SubpageLayout
      badge={
        <>
          <MessageSquare size={12} />
          Your activity
        </>
      }
      title={
        <>
          My{" "}
          <span className="bg-gradient-to-r from-brand-blue to-sky-400 bg-clip-text text-transparent">
            content
          </span>
        </>
      }
      subtitle={
        user?.firstName
          ? `Hi ${user.firstName} — everything you've shared on universities, programs, and cities.`
          : "Everything you've shared across the community."
      }
      maxWidth="lg"
    >
      <div className="mb-8 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all",
                active
                  ? "border border-brand-blue/30 bg-brand-blue/10 text-brand-blue shadow-md dark:border-sky-900/50 dark:bg-slate-800/90 dark:text-slate-100"
                  : "border border-slate-200/80 bg-white/80 text-slate-500 hover:border-brand-blue/30 hover:text-brand-blue dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
              )}
            >
              <Icon size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          variants={blurReveal}
          initial="hidden"
          animate="show"
          exit="hidden"
        >
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-brand-blue" size={32} />
            </div>
          ) : (
            <ContentList tab={tab} data={getTabData(tab, reviewsQ.data, questionsQ.data, answersQ.data)} />
          )}
        </motion.div>
      </AnimatePresence>

      <p className="mt-8 text-center text-sm text-slate-500">
        <Link
          to="/settings"
          className="font-semibold text-brand-blue hover:underline"
        >
          Account settings
        </Link>
      </p>
    </SubpageLayout>
  );
}

function getTabData(
  tab: Tab,
  reviews: Awaited<ReturnType<typeof fetchMyReviews>> | undefined,
  questions: Awaited<ReturnType<typeof fetchMyQuestions>> | undefined,
  answers: Awaited<ReturnType<typeof fetchMyAnsweredQuestions>> | undefined
) {
  if (tab === "reviews") return reviews ?? [];
  if (tab === "questions") return questions ?? [];
  return answers ?? [];
}

function ContentList({
  tab,
  data,
}: {
  tab: Tab;
  data: { _id: string; review?: string; rating?: number; question?: string }[];
}) {
  if (!data.length) {
    return (
      <SubpageCard className="py-16 text-center">
        <p className="text-slate-500 dark:text-slate-400">
          {tab === "reviews" && "You haven't posted any reviews yet."}
          {tab === "questions" && "You haven't asked any questions yet."}
          {tab === "answers" && "You haven't answered any questions yet."}
        </p>
        <Link
          to="/universities"
          className="mt-4 inline-block text-sm font-bold text-brand-blue hover:underline"
        >
          Explore universities
        </Link>
      </SubpageCard>
    );
  }

  return (
    <ul className="space-y-4">
      {data.map((item) => (
        <li key={item._id}>
          <SubpageCard className="p-5">
            {tab === "reviews" && "review" in item && item.review != null && (
              <>
                <div className="mb-2 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={
                        s <= Math.round(item.rating ?? 0)
                          ? "fill-brand-yellow text-brand-yellow"
                          : "text-slate-300"
                      }
                    />
                  ))}
                  <span className="ml-2 text-xs font-bold text-slate-500">
                    {item.rating}/5
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {item.review}
                </p>
              </>
            )}
            {(tab === "questions" || tab === "answers") && item.question && (
              <p className="text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                {item.question}
              </p>
            )}
          </SubpageCard>
        </li>
      ))}
    </ul>
  );
}

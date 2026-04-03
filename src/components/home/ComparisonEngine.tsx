import { Star } from "lucide-react";
import { UNIVERSITIES } from "../../constants";

const ComparisonEngine = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 dark:text-white">Comparison Engine</h2>
          <p className="text-slate-600 dark:text-slate-400">Make data-driven decisions with side-by-side analysis</p>
        </div>

        <div className="overflow-x-auto rounded-[2rem] border border-slate-100 dark:border-white/10 shadow-xl">
          <table className="w-full text-left border-collapse bg-white dark:bg-[#1e1e1e]">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5">
                <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Criteria</th>
                {UNIVERSITIES.slice(0, 3).map(uni => (
                  <th key={uni.id} className="p-6">
                    <div className="flex items-center gap-3">
                      <img src={uni.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                      <span className="font-bold dark:text-white">{uni.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {[
                { label: "National Ranking", key: "ranking" },
                { label: "Student Rating", key: "rating" },
                { label: "Climate Type", key: "climate" },
                { label: "Region", key: "region" }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-6 font-bold text-slate-600 dark:text-slate-400">{row.label}</td>
                  {UNIVERSITIES.slice(0, 3).map(uni => (
                    <td key={uni.id} className="p-6 dark:text-white">
                      {row.key === "rating" ? (
                        <div className="flex items-center gap-1 font-bold">
                          <Star size={14} className="text-brand-yellow" fill="currentColor" />
                          {uni.rating}
                        </div>
                      ) : (uni as any)[row.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ComparisonEngine;

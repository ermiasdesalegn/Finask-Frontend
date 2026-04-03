import { BookOpen, CheckCircle2, GraduationCap, Rocket, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

const JourneyStepper = () => {
  const steps = [
    { 
      title: "High School", 
      desc: "Complete Grade 12", 
      status: "completed",
      icon: BookOpen,
      color: "from-green-400 to-emerald-500",
      glow: "shadow-green-500/50"
    },
    { 
      title: "National Exam", 
      desc: "Score your best", 
      status: "current",
      icon: Sparkles,
      color: "from-yellow-400 to-amber-500",
      glow: "shadow-yellow-500/50"
    },
    { 
      title: "University Choice", 
      desc: "Pick your future", 
      status: "upcoming",
      icon: GraduationCap,
      color: "from-blue-400 to-cyan-500",
      glow: "shadow-blue-500/50"
    },
    { 
      title: "Registration", 
      desc: "Start your journey", 
      status: "upcoming",
      icon: Rocket,
      color: "from-purple-400 to-pink-500",
      glow: "shadow-purple-500/50"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-brand-blue via-blue-600 to-indigo-700 text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-96 h-96 border-4 border-white/20 rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] border-4 border-white/20 rounded-full"
        />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold mb-6 border border-white/20"
          >
            <Sparkles size={16} className="text-yellow-300" />
            Your Path to Success
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
            "Finote" <span className="text-yellow-300">Journey</span>
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Visualizing your transition to higher education, step by step
          </p>
        </motion.div>

        {/* Journey Steps */}
        <div className="relative">
          {/* Animated Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 -translate-y-1/2">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-green-400 via-yellow-400 via-blue-400 to-purple-400 rounded-full origin-left"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isCompleted = step.status === "completed";
              const isCurrent = step.status === "current";
              const isUpcoming = step.status === "upcoming";

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, type: "spring", stiffness: 100 }}
                  className="relative z-10"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={cn(
                      "relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 border transition-all duration-300",
                      isCompleted && "border-green-400/50 shadow-xl shadow-green-500/20",
                      isCurrent && "border-yellow-400/50 shadow-2xl shadow-yellow-500/30",
                      isUpcoming && "border-white/20"
                    )}
                  >
                    {/* Step Number Badge */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-xs font-black border border-white/30">
                      {i + 1}
                    </div>

                    {/* Icon Container */}
                    <motion.div
                      animate={isCurrent ? {
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="relative mb-6"
                    >
                      <div className={cn(
                        "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto relative overflow-hidden",
                        isCompleted && "bg-gradient-to-br from-green-400 to-emerald-500",
                        isCurrent && "bg-gradient-to-br from-yellow-400 to-amber-500",
                        isUpcoming && "bg-white/10"
                      )}>
                        {isCompleted ? (
                          <CheckCircle2 size={36} className="text-white" strokeWidth={3} />
                        ) : (
                          <Icon size={36} className={cn(
                            isCurrent ? "text-white" : "text-white/50"
                          )} />
                        )}
                        
                        {/* Glow Effect for Current Step */}
                        {isCurrent && (
                          <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-yellow-400 rounded-2xl"
                          />
                        )}
                      </div>

                      {/* Status Indicator */}
                      {isCurrent && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-400 text-black text-xs font-black rounded-full"
                        >
                          IN PROGRESS
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Content */}
                    <div className="text-center">
                      <h4 className="font-black text-xl mb-2">{step.title}</h4>
                      <p className={cn(
                        "text-sm",
                        isCompleted && "text-green-100",
                        isCurrent && "text-yellow-100",
                        isUpcoming && "text-blue-100"
                      )}>
                        {step.desc}
                      </p>
                    </div>

                    {/* Completion Checkmark */}
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 + 0.3, type: "spring", stiffness: 200 }}
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white"
                      >
                        <CheckCircle2 size={14} className="text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-brand-blue rounded-2xl font-black text-lg shadow-2xl hover:shadow-white/20 transition-all"
          >
            Start Your Journey Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default JourneyStepper;

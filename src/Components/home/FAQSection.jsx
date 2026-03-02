import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Loader2 } from "lucide-react";
import { faqAPI } from "../../Utils/api";

export default function FAQSection() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const data = await faqAPI.getFAQs();
        if (data.success) {
          setFaqs(data.faqs);
        } else {
          setError("Failed to load FAQs");
        }
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError("Something went wrong while fetching FAQs");
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="bg-[var(--color-dark)] py-20 px-6 md:px-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-sm font-medium tracking-[0.2em] uppercase mb-3"
            style={{ color: 'var(--color-primary)' }}
          >
            FAQs
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl md:text-3xl lg:text-4xl font-light text-white"
          >
            FREQUENTLY ASKED{' '}
            <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
              QUESTIONS
            </span>
          </motion.h2>
        </div>

        {/* FAQ List */}
        <div className="space-y-0 min-h-[200px] relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/40">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-[var(--color-primary)]" />
              <p className="text-sm tracking-widest uppercase">Loading FAQs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-[var(--color-primary)] border border-[var(--color-primary)]/30 px-6 py-2 rounded-full hover:bg-[var(--color-primary)]/10 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-20 text-white/40">
              <p>No questions found at the moment.</p>
            </div>
          ) : (
            faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={faq._id || i}
                  className={`group grid grid-cols-[72px_1fr] gap-0 md:gap-8 border-t border-b border-white/10 cursor-pointer relative overflow-hidden transition-all duration-300 hover:border-[var(--color-primary)]/30 ${isOpen ? "open" : ""
                    }`}
                  style={{ animationDelay: `${i * 0.08}s` }}
                  onClick={() => toggle(i)}
                  role="button"
                  aria-expanded={isOpen}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggle(i)}
                >

                  {/* Number */}
                  <div
                    className={`text-5xl font-bold leading-none relative z-10 pt-7 transition-colors duration-300 select-none ${isOpen ? "text-[var(--color-primary)]" : "text-white/15 group-hover:text-[var(--color-primary)]"
                      }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 py-7 pr-8 md:pr-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[0.6rem] font-medium tracking-[0.2em] uppercase text-[var(--color-primary)]">
                        {faq.tag}
                      </span>
                      <div className="w-6 h-px bg-[var(--color-primary)]/40" />
                    </div>
                    <h3
                      className={`text-lg md:text-xl font-semibold text-white leading-snug transition-colors duration-300 pr-10 group-hover:text-[var(--color-primary)]`}
                    >
                      {faq.question}
                    </h3>

                    {/* Animated answer */}
                    <div
                      className="grid transition-[grid-template-rows] duration-500 ease-out"
                      style={{
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                      }}
                    >
                      <div className="overflow-hidden">
                        <p className="text-lg text-white/60 leading-relaxed pb-7 pt-3 pr-10 border-t border-white/10 mt-1">
                          {faq.answer}
                        </p>
                      </div>
                    </div>

                    {/* Icon */}
                    <div
                      className={`absolute right-0 top-7 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 flex-shrink-0 ${isOpen
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                        : "border-white/20 group-hover:border-[var(--color-primary)] group-hover:bg-[var(--color-primary)]"
                        }`}
                    >
                      {isOpen ? (
                        <Minus size={12} strokeWidth={2.5} className="text-black" />
                      ) : (
                        <Plus size={12} strokeWidth={2.5} className="text-white/50 group-hover:text-black transition-colors duration-300" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer CTA */}
        <div className="flex items-center gap-4 mt-12 pt-8 border-t border-white/10">
          <p className="text-white/50 text-lg">
            Still have questions?
          </p>
          <a
            href="/contact"
            className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-[var(--color-primary)] border-b border-[var(--color-primary)] pb-0.5 transition-opacity hover:opacity-70"
          >
            Contact our team →
          </a>
        </div>
      </div>
      {/* Bottom Border - gradient fade (Desktop only, brighter in center) */}
      <div className="hidden md:flex justify-center mt-10">
        <div className="w-[80%] h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
    </section>
  );
}

import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
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

  // Generate FAQPage schema dynamically from fetched FAQs
  const faqSchema = useMemo(() => {
    if (!faqs || faqs.length === 0) return null;

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }, [faqs]);

  return (
    <>
      {faqSchema && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        </Helmet>
      )}

      <section className="bg-[var(--color-dark)] py-12 md:py-20 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-10">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-[10px] md:text-sm font-medium tracking-[0.2em] uppercase mb-3"
              style={{ color: 'var(--color-primary)' }}
            >
              FAQs
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl md:text-3xl lg:text-4xl font-light text-white uppercase tracking-tight"
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
                <p className="text-[10px] tracking-widest uppercase">Loading...</p>
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
                    // Mobile-first: flex layout, grid on md+ screens
                    className={`group flex flex-col md:grid md:grid-cols-[72px_1fr] gap-4 md:gap-8 border-t border-b border-white/10 cursor-pointer relative transition-all duration-300 hover:border-[var(--color-primary)]/30 ${isOpen ? "bg-white/[0.02]" : ""
                      }`}
                    onClick={() => toggle(i)}
                    role="button"
                    aria-expanded={isOpen}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && toggle(i)}
                  >
                    {/* Number - Scaled for mobile */}
                    <div
                      className={`text-3xl md:text-5xl font-bold leading-none pt-6 md:pt-7 transition-colors duration-300 select-none px-4 md:px-0 ${isOpen
                          ? "text-[var(--color-primary)]"
                          : "text-white/10 group-hover:text-[var(--color-primary)]"
                        }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    {/* Content */}
                    <div className="relative pb-6 md:py-7 pr-12 md:pr-0">
                      <div className="flex items-center gap-3 mb-2 px-4 md:px-0">
                        <span className="text-[10px] md:text-[0.6rem] font-medium tracking-[0.2em] uppercase" style={{ color: 'var(--color-primary)' }}>
                          {faq.tag}
                        </span>
                        <div className="w-6 h-px bg-[var(--color-primary)]/40" />
                      </div>

                      <h3
                        className={`text-base md:text-xl font-semibold text-white leading-snug transition-colors duration-300 px-4 md:px-0 group-hover:text-[var(--color-primary)]`}
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
                          <p className="text-sm md:text-lg text-white/60 leading-relaxed pb-4 md:pb-7 pt-3 border-t border-white/10 mt-3 px-4 md:px-0">
                            {faq.answer}
                          </p>
                        </div>
                      </div>

                      {/* Icon */}
                      <div
                        className={`absolute right-4 md:right-0 top-6 md:top-7 w-6 h-6 md:w-7 md:h-7 rounded-full border flex items-center justify-center transition-all duration-300 flex-shrink-0 ${isOpen
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                            : "border-white/20 group-hover:border-[var(--color-primary)] group-hover:bg-[var(--color-primary)]"
                          }`}
                      >
                        {isOpen ? (
                          <Minus size={10} strokeWidth={2.5} className="text-black" />
                        ) : (
                          <Plus size={10} strokeWidth={2.5} className="text-white/50 group-hover:text-black transition-colors duration-300" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer CTA */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-12 pt-8 border-t border-white/10">
            <p className="text-white/50 text-sm md:text-lg">Still have questions?</p>
            <a
              href="/contact"
              className="text-[10px] md:text-[0.75rem] font-bold tracking-[0.1em] uppercase text-[var(--color-primary)] border-b border-[var(--color-primary)] pb-0.5 transition-opacity hover:opacity-70"
            >
              Contact our team →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

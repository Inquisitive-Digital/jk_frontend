import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

/**
 * InlineFAQSection — renders a FAQ accordion from a prop array.
 * Used by BlogWrapper / ServiceWrapper when the blog/service has its own FAQs.
 * Does NOT fetch from the API; data comes straight from the parent.
 *
 * Props:
 *   faqs  — array of { question, answer, tag? }
 *   title — optional heading override (default "Frequently Asked Questions")
 */
export default function InlineFAQSection({ faqs = [], title }) {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  // Inject FAQPage JSON-LD for SEO
  const faqSchema = useMemo(() => {
    if (!faqs || faqs.length === 0) return null;
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    };
  }, [faqs]);

  if (!faqs || faqs.length === 0) return null;

  return (
    <>
      {faqSchema && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
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
              style={{ color: "var(--color-primary)" }}
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
              {title ? (
                title
              ) : (
                <>
                  FREQUENTLY ASKED{" "}
                  <span className="font-semibold" style={{ color: "var(--color-primary)" }}>
                    QUESTIONS
                  </span>
                </>
              )}
            </motion.h2>
          </div>

          {/* FAQ List */}
          <div className="space-y-0">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className={`group flex flex-col md:grid md:grid-cols-[72px_1fr] gap-4 md:gap-8 border-t border-b border-white/10 cursor-pointer relative transition-all duration-300 hover:border-[var(--color-primary)]/30 ${
                    isOpen ? "bg-white/[0.02]" : ""
                  }`}
                  onClick={() => toggle(i)}
                  role="button"
                  aria-expanded={isOpen}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggle(i)}
                >
                  {/* Number */}
                  <div
                    className={`text-3xl md:text-5xl font-bold leading-none pt-6 md:pt-7 transition-colors duration-300 select-none px-4 md:px-0 ${
                      isOpen
                        ? "text-[var(--color-primary)]"
                        : "text-white/10 group-hover:text-[var(--color-primary)]"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Content */}
                  <div className="relative pb-6 md:py-7 pr-12 md:pr-0">
                    {faq.tag && (
                      <div className="flex items-center gap-3 mb-2 px-4 md:px-0">
                        <span
                          className="text-[10px] md:text-[0.6rem] font-medium tracking-[0.2em] uppercase"
                          style={{ color: "var(--color-primary)" }}
                        >
                          {faq.tag}
                        </span>
                        <div className="w-6 h-px bg-[var(--color-primary)]/40" />
                      </div>
                    )}

                    <h3
                      className="text-base md:text-xl font-semibold text-white leading-snug transition-colors duration-300 px-4 md:px-0 group-hover:text-[var(--color-primary)]"
                    >
                      {faq.question}
                    </h3>

                    {/* Animated answer */}
                    <div
                      className="grid transition-[grid-template-rows] duration-500 ease-out"
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <p className="text-sm md:text-lg text-white/60 leading-relaxed pb-4 md:pb-7 pt-3 border-t border-white/10 mt-3 px-4 md:px-0">
                          {faq.answer}
                        </p>
                      </div>
                    </div>

                    {/* Toggle icon */}
                    <div
                      className={`absolute right-4 md:right-0 top-6 md:top-7 w-6 h-6 md:w-7 md:h-7 rounded-full border flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                        isOpen
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                          : "border-white/20 group-hover:border-[var(--color-primary)] group-hover:bg-[var(--color-primary)]"
                      }`}
                    >
                      {isOpen ? (
                        <Minus size={10} strokeWidth={2.5} className="text-black" />
                      ) : (
                        <Plus
                          size={10}
                          strokeWidth={2.5}
                          className="text-white/50 group-hover:text-black transition-colors duration-300"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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

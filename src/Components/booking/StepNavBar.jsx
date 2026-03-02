import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
function StepNavBar({
    onBack,
    onContinue,
    backLabel = "BACK",
    continueLabel = "CONTINUE",
    continueIcon: ContinueIcon = ArrowRight,
    disabled = false,
    isLoading = false,
    hideBack = false,
    hideContinue = false,
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-stretch gap-3 pt-6 sticky bottom-0 pb-6 z-10 w-full px-4 lg:px-8"
            style={{
                background: "transparent",
            }}
        >
            {/* ── Back / Edit Button ── */}
            {!hideBack && (
                <button
                    onClick={onBack}
                    type="button"
                    className="lg:hidden flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 shrink-0 whitespace-nowrap"
                    style={{
                        backgroundColor: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "rgba(255,255,255,0.7)",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.11)";
                        e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                    }}
                >
                    <ArrowLeft size={15} />
                    <span>{backLabel}</span>
                </button>
            )}

            {/* ── Continue / Primary Action Button ── */}
            {!hideContinue && (
                <button
                    onClick={onContinue}
                    type="button"
                    disabled={disabled || isLoading}
                    className="flex-1 min-w-0 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300"
                    style={
                        disabled || isLoading
                            ? {
                                backgroundColor: "rgba(255,255,255,0.04)",
                                color: "rgba(255,255,255,0.3)",
                                cursor: disabled ? "not-allowed" : "default",
                                border: "1px solid rgba(255,255,255,0.08)",
                            }
                            : {
                                backgroundColor: "var(--color-primary)",
                                color: "var(--color-dark)",
                                boxShadow: "0 8px 24px rgba(215,183,94,0.28)",
                                cursor:"pointer"
                            }
                    }
                    onMouseEnter={(e) => {
                        if (!disabled && !isLoading) {
                            e.currentTarget.style.boxShadow = "0 12px 32px rgba(215,183,94,0.4)";
                            e.currentTarget.style.transform = "translateY(-1px)";
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!disabled && !isLoading) {
                            e.currentTarget.style.boxShadow = "0 8px 24px rgba(215,183,94,0.28)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }
                    }}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={16} className="animate-spin shrink-0" />
                            <span className="truncate">Please wait...</span>
                        </>
                    ) : (
                        <>
                            <span className="truncate">{continueLabel}</span>
                            {ContinueIcon && <ContinueIcon size={15} className="shrink-0" />}
                        </>
                    )}
                </button>
            )}
        </motion.div>
    );
}

export default StepNavBar;

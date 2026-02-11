import { ArrowRight, Eye, Shield, Search } from "lucide-react";

export default function Hero({ onStart }) {
  return (
    <main className="relative min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Kicker */}
        <div className="animate-fade-up animate-delay-1">
          <span className="text-xs tracking-[0.25em] text-ink-muted uppercase font-medium">
            Detect Bias, Fallacies & Misinformation
          </span>
        </div>

        {/* Thick rule */}
        <div className="mt-5 mb-6 rule-thick max-w-xs mx-auto animate-fade-up animate-delay-1" />

        {/* Main title */}
        <h1 className="animate-fade-up animate-delay-2">
          <span className="font-[family-name:var(--font-serif)] text-5xl md:text-7xl leading-[1.05] block text-ink">
            Make Bias, Fallacies,
          </span>
          <span className="font-[family-name:var(--font-serif)] text-5xl md:text-7xl leading-[1.05] block text-ink italic">
            and Misinformation Visible
          </span>
        </h1>

        <div className="mt-6 mb-6 rule max-w-md mx-auto animate-fade-up animate-delay-2" />

        <p className="text-base text-ink-muted max-w-lg mx-auto leading-relaxed animate-fade-up animate-delay-3">
          Our mission is to equalize the playing field of information by highlighting
          the subtle mistakes in language that give unfair persuasive power to a
          speaker's words.
        </p>

        {/* CTA */}
        <div className="mt-10 animate-fade-up animate-delay-4">
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent-warm text-white font-semibold text-sm tracking-wide transition-colors"
          >
            Analyze a Document
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Cards */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto text-left">
          {[
            {
              icon: Eye,
              title: "The Misinformation Crisis",
              body: "Studies show that if you repeat a fallacy enough times, people will start to rate it as more truthful, even if they know it's logically flawed. Some studies show that the 'truth rating' can increase by 20–30% with repetition alone.",
              num: "01",
            },
            {
              icon: Shield,
              title: "Impact of Biased Language",
              body: "Research reveals that biased language in job postings reduces applicant diversity by up to 40%. Subtle linguistic bias affects hiring, healthcare, education, and media without writers even realizing it.",
              num: "02",
            },
            {
              icon: Search,
              title: "Why It Matters",
              body: "Clear and honest communication is the foundation of intellectual discourse. Progress can be made when participants can exchange ideas openly. When discussions are robbed of honesty and clarity, they devolve into debates where winning trumps truth.",
              num: "03",
            },
          ].map(({ icon: Icon, title, body, num }, i) => (
            <div
              key={i}
              className="p-5 bg-paper-warm border border-rule-light hover:border-rule transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-5 h-5 text-accent" />
                <span className="font-[family-name:var(--font-mono)] text-[10px] text-ink-faint">
                  {num}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-serif)] text-lg text-ink mb-2">
                {title}
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* Footer tagline */}
        <p className="mt-20 mb-8 text-xs text-ink-faint tracking-[0.15em] italic">
          Privacy first by design — your documents stay yours
        </p>
      </div>
    </main>
  );
}

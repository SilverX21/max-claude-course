import BenefitList from "./BenefitList";

type Benefit = { title: string; description: string };

const benefits: Benefit[] = [
  {
    title: "Ship faster",
    description:
      "Stop writing boilerplate. Claude Code generates, edits, and refactors end-to-end so you focus on what matters.",
  },
  {
    title: "Stay in flow",
    description:
      "Work entirely in the terminal. No tab switching, no context breaks — just you and your editor.",
  },
  {
    title: "Understand any codebase",
    description:
      "Ask Claude to explain code, trace logic, or map dependencies. Get up to speed on unfamiliar repos fast.",
  },
  {
    title: "Fewer bugs",
    description:
      "Claude writes tests, spots edge cases, and catches issues before they reach production.",
  },
  {
    title: "Automate the tedious",
    description:
      "Git commits, PR descriptions, docs — offload the work that doesn't need your full attention.",
  },
  {
    title: "Stay in control",
    description:
      "Claude shows its reasoning and diffs before applying changes. Every edit is yours to accept or reject.",
  },
];

export default function Home() {
  return (
    <div className="page">
      <div className="container">

        {/* Header strip */}
        <header className="page-header">
          <span className="label">Anthropic / Developer Tools</span>
          <span className="label">2024 — Present</span>
        </header>
        <hr className="rule rule-load rule-delay-1" />

        {/* Hero */}
        <section className="hero">
          <h1 className="hero-title">
            <span className="title-claude">Claude</span>
            <span className="title-code">Code.</span>
          </h1>
          <div className="hero-aside">
            <div className="hero-cursor-line">
              <span className="cursor-block" />
              <span className="label typing-label">terminal-native AI</span>
            </div>
            <p className="hero-description">
              An agentic coding tool that lives in your terminal,
              understands your entire codebase, and helps you ship
              faster without breaking flow.
            </p>
          </div>
        </section>
        <hr className="rule rule-load rule-delay-2" />

        {/* Benefits header */}
        <div className="section-header">
          <span className="label">Why Claude Code</span>
          <span className="label">06 reasons</span>
        </div>
        <hr className="rule rule-load rule-delay-3" />

        {/* Benefit rows — client boundary only where needed */}
        <BenefitList benefits={benefits} />

        {/* Footer */}
        <footer className="page-footer">
          <span className="label">© 2024 Anthropic PBC</span>
          <span className="label">Claude Code — v1</span>
        </footer>

      </div>
    </div>
  );
}

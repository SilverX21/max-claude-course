"use client";

import { useEffect, useRef } from "react";

type Benefit = { title: string; description: string };

const DELAY_CLASSES = [
  "benefit-delay-0",
  "benefit-delay-1",
  "benefit-delay-2",
  "benefit-delay-3",
  "benefit-delay-4",
  "benefit-delay-5",
];

export default function BenefitList({ benefits }: { benefits: Benefit[] }) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
    );

    itemRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {benefits.map((benefit, i) => (
        <div
          key={benefit.title}
          className={`benefit-item ${DELAY_CLASSES[i] ?? ""}`}
          ref={(el) => { itemRefs.current[i] = el; }}
        >
          <div className="benefit-row">
            <span className="benefit-number">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="benefit-content">
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          </div>
          <hr className="rule" />
        </div>
      ))}
    </>
  );
}

"use client";

import clsx from "clsx";
import {
  ArrowRight,
  Building2,
  Headphones,
  History,
  Sparkles,
} from "lucide-react";


const FEATURES = [
  {
    icon: History,
    title: "Unlimited message and file history",
    description: "Plus access to archives for every existing conversation",
  },
  {
    icon: Sparkles,
    title: "AI conversation summaries",
    description: "Get up to speed in any channel or thread with one click",
  },
  {
    icon: Headphones,
    title: "Group meetings with AI notes",
    description: "Use huddles in channels to get the whole team aligned",
  },
  {
    icon: Building2,
    title: "Work securely with external organizations",
    description: "Work in channels with external people",
  },
] as const;
type Props = {
  setIsHover: (value: boolean) => void;
};


export type ProUpgradeCardProps = {
  className?: string;
  /** Primary CTA */
  onUpgrade?: () => void;
  /** Secondary link */
  onCompareWithFree?: () => void;
  /** Circular arrow on a feature row (index 0–3) */
  onFeatureAction?: (featureIndex: number) => void;
  setIsHover: (value: boolean) => void;
};

/**
 * Slack-style “Get started with Pro” promotional card.
 */
export function ProUpgradeCard({
  className,
  onUpgrade,
  onCompareWithFree,
  onFeatureAction,
  setIsHover
}: ProUpgradeCardProps) {
  return (
    <div
      className={clsx(
        "w-full max-w-[400px] overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)]",
        className,
      )}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {/* Header — lavender + decorative blobs + wave into white */}
      <div className="relative overflow-hidden bg-[#f3edff] px-6 pb-10 pt-8 text-center">
        <div
          className="pointer-events-none absolute -left-6 -top-4 h-28 w-28 rounded-full bg-[#e9d5ff]/70 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-4 top-2 h-24 w-24 rounded-full bg-[#c4b5fd]/50 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/3 top-0 h-16 w-16 rounded-full bg-[#ddd6fe]/60 blur-xl"
          aria-hidden
        />

        <div className="relative z-10 mb-3 text-[52px] leading-none" role="img" aria-label="">
          🚀
        </div>
        <h2 className="relative z-10 text-[22px] font-bold leading-tight tracking-tight text-[#1d1c1d]">
          Get started with Pro
        </h2>
        <p className="relative z-10 mt-2 text-[14px] leading-snug text-[#616061]">
          Some things for you and your team to try.
        </p>

        <svg
          className="absolute bottom-0 left-0 h-[22px] w-full text-white"
          viewBox="0 0 400 22"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M0,8 C80,22 160,0 200,10 C240,20 320,2 400,12 L400,22 L0,22 Z"
          />
        </svg>
      </div>

      {/* Feature list */}
      <div className="bg-white">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="flex items-center gap-3 border-b border-[#e8e8e8] px-5 py-4 last:border-b-0 cursor-pointer hover:bg-amber-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[#611f69]">
                <Icon className="h-6 w-6" strokeWidth={1.35} aria-hidden />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-[14px] font-semibold leading-snug text-[#1d1c1d]">
                  {feature.title}
                </p>
                <p className="mt-0.5 text-[13px] leading-snug text-[#616061]">
                  {feature.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onFeatureAction?.(index)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ede9fe] text-[#611f69] transition-colors hover:bg-[#ddd6fe] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#611f69]"
                aria-label={`Learn more: ${feature.title}`}
              >
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="bg-white px-5 pb-6 pt-2">
        <button
          type="button"
          onClick={onUpgrade}
          className="h-11 w-full rounded-lg bg-[#007a5a] text-[15px] font-bold text-white shadow-sm transition-colors hover:bg-[#006c4f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007a5a]"
        >
          Upgrade Now
        </button>
        <button
          type="button"
          onClick={onCompareWithFree}
          className="mt-3 w-full text-center text-[14px] font-medium text-[#1264a3] underline-offset-2 hover:underline"
        >
          Compare with Free
        </button>
      </div>
    </div>
  );
}

export default ProUpgradeCard;

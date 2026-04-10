import React from "react";
import {
    FiSettings,
    FiChevronDown,
    FiArrowRight,
    FiMessageSquare,
    FiZap,
    FiHeadphones,
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { HiOutlineRocketLaunch } from "react-icons/hi2";

type FeatureItem = {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
};

export type PlanOverviewPageProps = {
    heading?: string;
    trialDaysLeft?: number;
    onComparePlans?: () => void;
    onManagePlan?: () => void;
    onUpgradeNow?: () => void;
    onFeatureClick?: (featureId: string) => void;
    activeTab?: string;
};

const features: FeatureItem[] = [
    {
        id: "history",
        title: "Unlimited message and file history",
        description: "Plus access to archives for every existing conversation",
        icon: <FiMessageSquare size={18} />,
    },
    {
        id: "summaries",
        title: "AI conversation summaries",
        description: "Get up to speed in any channel or thread with one click",
        icon: <BsStars size={16} />,
    },
    {
        id: "meetings",
        title: "Group meetings",
        description: "Use huddles in channels to get the whole team aligned",
        icon: <FiHeadphones size={18} />,
    },
    {
        id: "ai-meetings",
        title: "Group meetings with AI notes",
        description: "Use huddles in channels to get the whole team aligned",
        icon: <FiHeadphones size={18} />,
    },
];

const tabs = ["All", "AI", "Productivity and collaboration", "Automation"];

export default function PlanOverviewPage({
    heading = "About your plan",
    trialDaysLeft = 6,
    onComparePlans,
    onManagePlan,
    onUpgradeNow,
    onFeatureClick,
    activeTab = "All",
}: PlanOverviewPageProps) {
    return (
        <div className="w-full min-h-screen bg-[#f8f8f8] text-[#1d1c1d] font-sans">
            <div className="flex items-center justify-between border-b border-[#dedede] bg-white px-7 py-3">
                <h1 className="text-[18px] font-bold">{heading}</h1>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onComparePlans}
                        className="rounded-xl border border-[#d6d6d6] bg-white px-4 py-2 text-[15px] font-semibold text-[#1d1c1d] shadow-sm hover:bg-[#f8f8f8]"
                    >
                        Compare plans
                    </button>

                    <button
                        onClick={onManagePlan}
                        className="flex items-center gap-2 rounded-xl border border-[#d6d6d6] bg-white px-4 py-2 text-[15px] font-semibold text-[#1d1c1d] shadow-sm hover:bg-[#f8f8f8]"
                    >
                        <FiSettings size={16} />
                        <span>Manage Plan</span>
                        <FiChevronDown size={16} />
                    </button>
                </div>
            </div>

            <section className="relative overflow-hidden bg-[#f0e4f4] pb-24">
                <div className="pointer-events-none absolute left-[-120px] top-[-160px] h-[340px] w-[600px] rounded-full bg-[#e3c9ef]" />
                <div className="pointer-events-none absolute bottom-[-240px] right-[-120px] h-[420px] w-[420px] rounded-full bg-[#e3c9ef]" />
                <div className="pointer-events-none absolute bottom-[-240px] left-[-120px] h-[320px] w-[1200px] rounded-[50%] bg-[#f8f8f8]" />

                <div className="relative z-10 mx-auto max-w-[1200px] px-8 pt-10">
                    <div className="flex flex-col items-center text-center">
                        <HiOutlineRocketLaunch className="mb-3 text-[36px] text-[#5a2a82]" />
                        <h2 className="text-[40px] font-extrabold leading-tight tracking-[-0.03em]">
                            Last week to explore Pro features
                        </h2>
                        <p className="mt-4 max-w-[1120px] text-[15px] leading-8 text-[#2f2f2f]">
                            Your organization is on a free trial of the Pro plan for the next{" "}
                            <span className="font-bold">{trialDaysLeft} days</span>. Upgrade now to
                            keep your team running smoothly.
                        </p>

                        <button
                            onClick={onUpgradeNow}
                            className="mt-8 rounded-xl bg-[#007a5a] px-4 py-2 text-[16px] font-bold text-white hover:bg-[#006c50]"
                        >
                            Upgrade Now
                        </button>
                    </div>

                    <div className="mt-12 overflow-hidden rounded-2xl bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr]">
                            <div className="bg-white p-3 ">
                                <img src="/move.gif" alt="move" />
                            </div>

                            <div className="flex flex-col bg-white px-2 py-2">
                                {features.map((feature, index) => (
                                    <button
                                        key={feature.id}
                                        onClick={() => onFeatureClick?.(feature.id)}
                                        className={`flex items-center gap-4 px-6 py-6 text-left hover:bg-[#fafafa] ${index !== features.length - 1 ? "border-b border-[#e8e8e8]" : ""
                                            }`}
                                    >
                                        <div className="text-[#6a2b83]">{feature.icon}</div>

                                        <div className="min-w-0 flex-1">
                                            <div className="text-[17px] font-bold leading-6">{feature.title}</div>
                                            <div className="mt-1 text-[15px] leading-6 text-[#616061]">
                                                {feature.description}
                                            </div>
                                        </div>

                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3e8f8] text-[#6a2b83]">
                                            <FiArrowRight size={16} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1100px] px-8 pb-16 pt-16">
                <h3 className="text-[28px] font-extrabold tracking-[-0.02em]">
                    Learn more about each feature
                </h3>
                <p className="mt-3 max-w-[980px] text-[17px] leading-7 text-[#4b4b4b]">
                    These articles give you an in depth look at individual features available
                    in your plan. AI features are available based on your admin’s settings.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                    {tabs.map((tab) => {
                        const selected = tab === activeTab;
                        return (
                            <button
                                key={tab}
                                className={`rounded-xl border px-4 py-2 text-[15px] font-semibold ${selected
                                        ? "border-[#1264a3] bg-[#1264a3] text-white"
                                        : "border-[#d8d8d8] bg-white text-[#1d1c1d] hover:bg-[#f8f8f8]"
                                    }`}
                            >
                                {selected ? "✓ " : ""}
                                {tab}
                            </button>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
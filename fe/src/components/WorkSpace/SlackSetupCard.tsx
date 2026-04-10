import React from "react";

export type SlackSetupStep = {
    id: string;
    title: string;
    description: string;
    completed?: boolean;
};

export type SlackSetupCardProps = {
    currentStep?: number;
    totalSteps?: number;
    title?: string;
    steps?: SlackSetupStep[];
    footerText?: string;
    footerLinkText?: string;
    onClose?: () => void;
    onStepClick?: (step: SlackSetupStep, index: number) => void;
    onFooterLinkClick?: () => void;
};

const defaultSteps: SlackSetupStep[] = [
    {
        id: "profile",
        title: "Put a face to your name",
        description: "Add a profile picture and edit your name",
        completed: false,
    },
    {
        id: "find-people",
        title: "Find someone you know",
        description: "Say hi and make someone’s day brighter",
        completed: true,
    },
    {
        id: "mobile",
        title: "Use Slack on the go",
        description: "Download the mobile app",
        completed: false,
    },
    {
        id: "tools",
        title: "Add your existing tools to Slack",
        description: "Connect your calendar, project management tool, and more",
        completed: false,
    },
];

function LeafIcon() {
    return (
        <img src="/plant.png" alt="plant" width={20} />
    );
}

function CloseIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function ChevronRightIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function CircleIncomplete() {
    return (
        <div
            aria-hidden="true"
            style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                border: "2px solid #4a67ff",
                background: "#ffffff",
                boxSizing: "border-box",
                flexShrink: 0,
            }}
        />
    );
}

function CircleComplete() {
    return (
        <div
            aria-hidden="true"
            style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "#4a67ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                flexShrink: 0,
            }}
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                    d="M5 13L10 18L19 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}

export function SlackSetupCard({
    currentStep = 1,
    totalSteps = 4,
    title = "Set up your Slack",
    steps = defaultSteps,
    footerText = "Not your first Slack rodeo?",
    footerLinkText = "Don’t show this again",
    onClose,
    onStepClick,
    onFooterLinkClick,
}: SlackSetupCardProps) {
    const progressPercent =
        totalSteps > 0 ? Math.max(0, Math.min(100, (currentStep / totalSteps) * 100)) : 0;

    return (
        <div
            style={{
                width: 360,
                borderRadius: 14,
                border: "1px solid #d8d8d8",
                background: "#ffffff",
                boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                overflow: "hidden",
                fontFamily:
                    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                color: "#1d1c1d",
            }}
        >
            <div style={{ padding: "18px 18px 8px 18px" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 18,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <LeafIcon />
                        <h2
                            style={{
                                margin: 0,
                                fontSize: 22,
                                fontWeight: 700,
                                letterSpacing: "-0.02em",
                            }}
                        >
                            {title}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        style={{
                            border: "none",
                            background: "transparent",
                            padding: 4,
                            cursor: "pointer",
                            color: "#5e5d60",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: 10,
                        alignItems: "center",
                        marginBottom: 18,
                    }}
                >
                    <div
                        style={{
                            height: 12,
                            borderRadius: 999,
                            background: "#c8d2ff",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                width: `${progressPercent}%`,
                                height: "100%",
                                background: "#4a67ff",
                            }}
                        />
                    </div>
                    <div
                        style={{
                            fontSize: 15,
                            color: "#5e5d60",
                            lineHeight: 1,
                        }}
                    >
                        {currentStep}/{totalSteps}
                    </div>
                </div>

                <div>
                    {steps.map((step, index) => (
                        <button
                            key={step.id}
                            type="button"
                            onClick={() => onStepClick?.(step, index)}
                            style={{
                                width: "100%",
                                display: "grid",
                                gridTemplateColumns: "36px 1fr 18px",
                                gap: 12,
                                alignItems: "start",
                                padding: "12px 4px",
                                background: "transparent",
                                border: "none",
                                textAlign: "left",
                                cursor: onStepClick ? "pointer" : "default",
                            }}
                        >
                            <div style={{ paddingTop: 2 }}>
                                {step.completed ? <CircleComplete /> : <CircleIncomplete />}
                            </div>

                            <div>
                                <div
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 700,
                                        lineHeight: 1.25,
                                        marginBottom: 4,
                                        color: "#1d1c1d",
                                    }}
                                >
                                    {step.title}
                                </div>
                                <div
                                    style={{
                                        fontSize: 14,
                                        lineHeight: 1,
                                        color: "#616061",
                                    }}
                                >
                                    {step.description}
                                </div>
                            </div>

                            <div
                                style={{
                                    paddingTop: 6,
                                    color: "#6b6a6d",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <ChevronRightIcon />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div
                style={{
                    borderTop: "1px solid #ececec",
                    background: "#f8f8f8",
                    padding: "12px 18px",
                    fontSize: 14,
                    color: "#5e5d60",
                }}
            >
                <span>{footerText} </span>
                <button
                    type="button"
                    onClick={onFooterLinkClick}
                    style={{
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        margin: 0,
                        color: "#1264a3",
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    {footerLinkText}
                </button>
            </div>
        </div>
    );
}

export default SlackSetupCard;
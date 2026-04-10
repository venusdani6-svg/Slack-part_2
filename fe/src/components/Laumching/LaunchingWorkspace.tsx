"use client"; // Required because we may add client-side effects (like redirect or timers)

import { useEffect, useState } from "react"; // Used for optional redirect behavior

// Props definition for reusability and scalability
type LaunchingWorkspaceProps = {
    workspaceName: string; // Name displayed in heading
    initials: string; // Workspace icon initials (e.g., NW)
    autoRedirect?: boolean; // Optional: simulate Slack auto-open behavior
};

export default function LaunchingWorkspace({
    workspaceName,
    initials,
    autoRedirect = false, // Default disabled for flexibility
}: LaunchingWorkspaceProps) {

    // Optional: simulate Slack-like auto redirect after delay
    const [showSpinner, setShowSpinner] = useState(true);
    const [messageStep, setMessageStep] = useState(0);
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSpinner(false); // hide after 2 seconds
        }, 3000);

        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        const timers = [
          setTimeout(() => setMessageStep(1), 500),   // "Ironing folds..."
          setTimeout(() => setMessageStep(2), 1000),  // "Boiling water..."
          setTimeout(() => setMessageStep(3), 2000),  // "Focusing figments..."
          setTimeout(() => setMessageStep(4), 3000),  // Final paragraph
        ];
      
        return () => timers.forEach(clearTimeout);
      }, []);
    return (
        // Root container: exact Slack-like neutral background and vertical centering
        <div className="min-h-screen bg-[#f8f8f8] flex flex-col items-center pt-[200px] text-center">

            {/* Top Slack logo */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2">
                {/* Perfect horizontal centering using transform */}
                <img
                    src="/slack_logo.svg" // Use official Slack logo asset
                    alt="Slack"
                    className="h-[24px] w-auto" // Slack uses small logo (~24px height)
                />
            </div>

            {/* Workspace Icon */}
            <div
                className="w-[56px] h-[56px]  rounded-[12px]  bg-[#6b6b6b]  flex items-center justify-center  text-white  text-[20px]  font-semibold  mb-[24px] relative"
            >
                {initials} {/* Workspace initials */}
            </div>
            {showSpinner && (
                <span
                    className="absolute top-[168px] inline-block w-[120px] h-[120px] border-[5px] border-gray-200 border-b-[#1a3d7a] rounded-full box-border animate-spin"
                />
            )}


            {/* Title */}
            <h1
                className="text-[42px] leading-[40px] font-bold text-[#1d1c1d] mt-[50px]"
            >
                Launching {workspaceName}
            </h1>

            {/* Description */}
            <div className="text-[18px] leading-[24px] text-[#616061] max-w-[420px] h-[48px] mt-4">
                {messageStep === 0 && <p>...</p>}
                {messageStep === 1 && <p>Ironing folds...</p>}
                {messageStep === 2 && <p>Boiling water...</p>}
                {messageStep === 3 && <p>Focusing figments...</p>}

                {messageStep === 4 && (
                    <p>
                        Click
                        <span className="font-semibold text-[#1d1c1d]">
                            "Open Slack"
                        </span>
                        to launch the desktop app.
                        <br />
                        Not working? You can also
                        <a
                            href="#"
                            className="text-[#1264a3] hover:underline font-medium"
                        >
                            use Slack in your browser
                        </a>.
                    </p>
                )}
            </div>
        </div>
    );
}
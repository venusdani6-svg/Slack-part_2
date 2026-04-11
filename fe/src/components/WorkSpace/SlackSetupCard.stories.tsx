import type { Meta, StoryObj } from "@storybook/react";
import { SlackSetupCard } from "./SlackSetupCard";

const meta: Meta<typeof SlackSetupCard> = {
    title: "Slack/SlackSetupCard",
    component: SlackSetupCard,
    parameters: {
        layout: "centered",
    },
};

export default meta;

type Story = StoryObj<typeof SlackSetupCard>;

export const Default: Story = {
    args: {
        currentStep: 1,
        totalSteps: 4,
        steps: [
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
        ],
    },
};

export const HalfComplete: Story = {
    args: {
        currentStep: 2,
        totalSteps: 4,
        steps: [
            {
                id: "profile",
                title: "Put a face to your name",
                description: "Add a profile picture and edit your name",
                completed: true,
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
        ],
    },
};
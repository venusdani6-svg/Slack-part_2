import type { Meta, StoryObj } from "@storybook/react";
import PlanOverviewPage from "./PlanOverviewPage";

const meta: Meta<typeof PlanOverviewPage> = {
    title: "Pages/PlanOverviewPage",
    component: PlanOverviewPage,
    parameters: {
        layout: "fullscreen",
    },
};

export default meta;

type Story = StoryObj<typeof PlanOverviewPage>;

export const Default: Story = {
    args: {
        heading: "About your plan",
        trialDaysLeft: 6,
        activeTab: "All",
    },
};

export const AISelected: Story = {
    args: {
        heading: "About your plan",
        trialDaysLeft: 6,
        activeTab: "AI",
    },
};

export const ShortTrial: Story = {
    args: {
        heading: "About your plan",
        trialDaysLeft: 2,
        activeTab: "Productivity and collaboration",
    },
};
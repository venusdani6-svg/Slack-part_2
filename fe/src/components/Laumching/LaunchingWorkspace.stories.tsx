import type { Meta, StoryObj } from "@storybook/react";
import LaunchingWorkspace from "./LaunchingWorkspace";

// Metadata for Storybook UI
const meta: Meta<typeof LaunchingWorkspace> = {
  title: "Slack/LaunchingWorkspace", // Clear grouping
  component: LaunchingWorkspace,
  parameters: {
    layout: "fullscreen", // Required for pixel accuracy
  },
};

export default meta;

type Story = StoryObj<typeof LaunchingWorkspace>;

// Default Slack-like state
export const Default: Story = {
  args: {
    workspaceName: "New Workspace",
    initials: "NW",
  },
};

// With simulated redirect behavior
export const AutoRedirect: Story = {
  args: {
    workspaceName: "Engineering",
    initials: "EN",
    autoRedirect: true,
  },
};
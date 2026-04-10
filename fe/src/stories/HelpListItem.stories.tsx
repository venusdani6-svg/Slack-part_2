import HelpListItem from "@/components/workspaceHeaderPage/directories/help/HelpListItem";
import type { Meta, StoryObj } from "@storybook/react";
import { FiBell } from "react-icons/fi";

const meta: Meta<typeof HelpListItem> = {
  title: "Help/ListItem",
  component: HelpListItem,
};

export default meta;

type Story = StoryObj<typeof HelpListItem>;

export const Default: Story = {
  args: {
    icon: FiBell,
    label: "Configure your Slack notifications",
  },
};
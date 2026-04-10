import HelpDiscoverCard from "@/components/workspaceHeaderPage/directories/help/HelpDiscoverCard";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof HelpDiscoverCard> = {
  title: "Help/DiscoverCard",
  component: HelpDiscoverCard,
};

export default meta;

type Story = StoryObj<typeof HelpDiscoverCard>;

export const Default: Story = {
  args: {
    title: "Quick start guide",
    description: "Learn the basics and get to work in Slack",
    image: "https://via.placeholder.com/260x120",
  },
};
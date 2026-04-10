import type { Meta, StoryObj } from "@storybook/react";
import HelpPageFull from "../components/workspaceHeaderPage/directories/help/HelpFullPage";

const meta: Meta<typeof HelpPageFull> = {
  title: "Help/FullPage",
  component: HelpPageFull,
  parameters: {
    layout: "centered", // centers the modal like Slack
  },
};

export default meta;

type Story = StoryObj<typeof HelpPageFull>;

export const Default: Story = {
  render: () => (
    <div className=" h-full flex items-center justify-center p-[40px]">
      <HelpPageFull />
    </div>
  ),
};
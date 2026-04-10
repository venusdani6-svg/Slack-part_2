import ChannelMembersModalPage from "@/components/workspaceHeaderPage/directories/help/ChannelModal";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ChannelMembersModalPage> = {
  title: "Pages/ChannelMembersModalPage",
  component: ChannelMembersModalPage,

  parameters: {
    layout: "fullscreen", // IMPORTANT: modal needs full viewport
  },
};

export default meta;

type Story = StoryObj<typeof ChannelMembersModalPage>;

export const Default: Story = {
  render: () => (
    <div style={{ height: "100vh" }}>
      <ChannelMembersModalPage />
    </div>
  ),
};
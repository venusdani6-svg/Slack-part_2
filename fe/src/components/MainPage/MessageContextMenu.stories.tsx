import type { Meta, StoryObj } from "@storybook/react";
import MessageContextMenu from "./MessageContextMenu";

const meta: Meta<typeof MessageContextMenu> = {
  title: "components\MainPage",
  component: MessageContextMenu,
  parameters: {
    layout: "centered",
  },
};        

export default meta;

type Story = StoryObj<typeof MessageContextMenu>;

/* Default view */
export const Default: Story = {};

/* On dark background (important for contrast testing) */
export const OnDarkBackground: Story = {
  decorators: [
    (Story) => (
      <div className="bg-[#1d1c1d] p-10 min-h-screen flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

/* Inside a chat-like container */
export const InChatMock: Story = {
  decorators: [
    (Story) => (
      <div className="bg-[#f8f8f8] p-10 min-h-screen flex items-start justify-center">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm mb-2 text-gray-600">
            Right-click message simulation
          </p>
          <Story />
        </div>
      </div>
    ),
  ],
};
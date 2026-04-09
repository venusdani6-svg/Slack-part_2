import type { Meta, StoryObj } from "@storybook/react";
import ChannelOptionsMenu from "./ChannelOptionsMenu";

const meta: Meta<typeof ChannelOptionsMenu> = {
    title: "components\workSpace/ChannelOptionsMenu",
    component: ChannelOptionsMenu,
    parameters: {
        layout: "fullscreen",
    },
};

export default meta;

type Story = StoryObj<typeof ChannelOptionsMenu>;

export const Default: Story = {};
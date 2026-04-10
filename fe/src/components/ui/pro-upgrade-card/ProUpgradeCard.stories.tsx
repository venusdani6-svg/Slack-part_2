import type { Meta, StoryObj } from "@storybook/react";
import { ProUpgradeCard } from "./ProUpgradeCard";

const meta: Meta<typeof ProUpgradeCard> = {
  title: "UI/ProUpgradeCard",
  component: ProUpgradeCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: { default: "gray" },
  },
  args: {
    onUpgrade: () => console.log("Upgrade Now"),
    onCompareWithFree: () => console.log("Compare with Free"),
    onFeatureAction: (i) => console.log("Feature action", i),
  },
};

export default meta;
type Story = StoryObj<typeof ProUpgradeCard>;

/** Default card matching the Pro upgrade promo layout */
export const Default: Story = {};

/** On a light page background */
export const OnLightBackground: Story = {
  parameters: {
    backgrounds: { default: "light" },
  },
};

/** Without action handlers (visual only) */
export const Static: Story = {
  args: {
    onUpgrade: undefined,
    onCompareWithFree: undefined,
    onFeatureAction: undefined,
  },
};

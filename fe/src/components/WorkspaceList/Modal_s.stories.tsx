
// =============================
// TemplateCard.stories.tsx
// =============================

import type { Meta, StoryObj } from "@storybook/react";
// import TemplateCard from "./TemplateCard";
import TemplateCard from "./Modal_s";

const meta: Meta<typeof TemplateCard> = {
  title: "design-system/TemplateCard",
  component: TemplateCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    tone: {
      control: "select",
      options: ["default", "primary"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof TemplateCard>;

export const Default: Story = {
  args: {
    title: "Get started with a template.",
    description: "Kickstart projects with one click.",
    buttonText: "Browse templates",
  },
};

export const Primary: Story = {
  args: {
    ...Default.args,
    tone: "primary",
  },
};

export const Large: Story = {
  args: {
    ...Default.args,
    size: "lg",
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

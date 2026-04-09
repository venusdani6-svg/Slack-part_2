import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { WorkspaceNameMenu } from "./WorkspaceNameMenu"

const meta: Meta<typeof WorkspaceNameMenu> = {
  title: "components/Layout/chat/WorkspaceNameMenu",
  component: WorkspaceNameMenu,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof WorkspaceNameMenu>;

// 1. Default
export const Default: Story = {
  render: () => <WorkspaceNameMenu />,
};

// 2. Instructional interaction (manual hover)
export const WithSubmenu: Story = {
  render: () => (
    <div>
      <p className="text-sm text-gray-500 mb-2">
        Hover over <b>\"Tools & settings\"</b> to open submenu
      </p>
      <WorkspaceNameMenu />
    </div>
  ),
};

// 3. Visual stress: small container
export const Constrained: Story = {
  render: () => (
    <div className="w-[260px] h-[300px] overflow-hidden border p-2">
      <WorkspaceNameMenu />
    </div>
  ),
};

// 4. Visual contrast: dark background
export const DarkModePreview: Story = {
  render: () => (
    <div className="bg-gray-900 p-10">
      <WorkspaceNameMenu />
    </div>
  ),
};

// 5. Scroll / overflow scenario
export const ScrollContainer: Story = {
  render: () => (
    <div className="h-[200px] overflow-y-scroll border p-2">
      <WorkspaceNameMenu />
    </div>
  ),
};
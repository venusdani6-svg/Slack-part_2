// /data/domi.ts

export type TextBlock = {
  type: "text";
  variant?: "header" | "normal";
  title: string;
  description: string;
};

export type TreeBlock = {
  type: "tree";
  header: string;
  comment?: string;
  members?: string[];
};

export type BannerBlock = {
  type: "banner";
  text: string;
};

export type LinkBlock = {
  type: "link";
  text: string;
};

export type ContentBlockProps =
  | TextBlock
  | TreeBlock
  | BannerBlock
  | LinkBlock;

/* =========================
   REGISTRY DATA
========================= */

export const helpContent = [
  {
    type: "text",
    variant: "header",
    title: "Identify Slack Connect conversations",
    description:
      "When you hover over a channel name or DM, you'll see if any external organizations are in the conversation...",
  },

  {
    type: "tree",
    header: "Channel ownership",
    comment:
      "Your organization owns any channels created in your workspace...",
    members: [
      "Invite organizations",
      "Remove other organizations",
      "Manage posting permissions",
      "Continue using the channel if external organizations have been removed or disconnected",
    ],
  },

  {
    type: "tree",
    header: "Using apps and workflows",
    comment:
      "When using apps and workflows in a channel with people outside your company...",
    members: [
      "You can decide who can use workflows...",
      "Shortcuts associated with apps are available...",
      "Apps added by another organization will include that organization's Slack icon...",
      "People in the channel can see messages from bots...",
      "Your organization's custom apps can only be used by your organization...",
    ],
  },

  {
    type: "tree",
    header: "Slack Connect for DMs",
    comment:
      "If you'd like to communicate one-on-one with someone...",
  },

  {
    type: "text",
    title: "Manage Slack Connect",
    description: "To manage Slack Connect all in one place...",
  },

  {
    type: "text",
    title: "View member profiles",
    description:
      "Organizations can choose what profile information...",
  },

  {
    type: "text",
    title: "Using custom emoji",
    description:
      "You can use your organization's custom emoji...",
  },

  {
    type: "banner",
    text: "For an in-depth look at Slack Connect, take our course and test your knowledge.",
  },

  {
    type: "link",
    text: "View in our Help Center",
  },
] satisfies ContentBlockProps[];
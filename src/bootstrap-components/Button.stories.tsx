import type { Meta, StoryObj } from "@storybook/react";
import { Button, Spinner } from "react-bootstrap";
import { ShoppingBag, Plus, Check, X, ArrowRight, Download } from "react-feather";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Custom button styles for actions in forms, dialogs, and more with support for multiple sizes, states, and more.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark", "link"],
      description: "Button variant",
      table: {
        category: "Variant",
      },
    },
    outline: {
      control: "boolean",
      description: "Use outline style (no background)",
      table: {
        category: "Variant",
      },
    },
    size: {
      control: "select",
      options: ["sm", undefined, "lg"],
      description: "Button size",
      table: {
        category: "Variant",
      },
    },
    block: {
      control: "boolean",
      description: "Full-width block button",
      table: {
        category: "Variant",
      },
    },
    text: {
      control: "text",
      description: "Button text",
      table: {
        category: "Content",
      },
    },
    icon: {
      control: "select",
      options: ["none", "ShoppingBag", "Plus", "Check", "X", "ArrowRight", "Download"],
      description: "Icon to display",
      table: {
        category: "Content",
      },
    },
    iconPosition: {
      control: "select",
      options: ["left", "right"],
      description: "Icon position",
      table: {
        category: "Content",
      },
    },
    iconSize: {
      control: { type: "number", min: 12, max: 24, step: 1 },
      description: "Icon size in pixels",
      table: {
        category: "Content",
      },
    },
    active: {
      control: "boolean",
      description: "Active state",
      table: {
        category: "State",
      },
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
      table: {
        category: "State",
      },
    },
    loading: {
      control: "boolean",
      description: "Loading state with spinner",
      table: {
        category: "State",
      },
    },
    backgroundColor: {
      control: "color",
      description: "Background color (overrides variant)",
      table: {
        category: "Styling",
      },
    },
    textColor: {
      control: "color",
      description: "Text color (overrides variant)",
      table: {
        category: "Styling",
      },
    },
    borderColor: {
      control: "color",
      description: "Border color (overrides variant)",
      table: {
        category: "Styling",
      },
    },
    borderRadius: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
      description: "Border radius",
      table: {
        category: "Styling",
      },
    },
    fontSize: {
      control: "select",
      options: ["sm", "base", "lg"],
      description: "Font size",
      table: {
        category: "Styling",
      },
    },
    fontWeight: {
      control: "select",
      options: ["normal", "medium", "bold"],
      description: "Font weight",
      table: {
        category: "Styling",
      },
    },
    paddingX: {
      control: { type: "number", min: 8, max: 32, step: 1 },
      description: "Horizontal padding in pixels",
      table: {
        category: "Styling",
      },
    },
    paddingY: {
      control: { type: "number", min: 4, max: 16, step: 1 },
      description: "Vertical padding in pixels",
      table: {
        category: "Styling",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

const iconMap: Record<string, React.ComponentType<{ size?: string | number }>> = {
  ShoppingBag,
  Plus,
  Check,
  X,
  ArrowRight,
  Download,
};

export const Primary: Story = {
  args: {
    variant: "primary",
    outline: false,
    size: undefined,
    block: false,
    text: "Button",
    icon: "none",
    iconPosition: "left",
    iconSize: 18,
    active: false,
    disabled: false,
    loading: false,
    borderRadius: "md",
    fontSize: "base",
    fontWeight: "normal",
    paddingX: 16,
    paddingY: 8,
  },
  render: (args) => {
    const IconComponent = args.icon !== "none" ? iconMap[args.icon] : null;

    const getVariant = () => {
      if (args.outline && args.variant) {
        return `outline-${args.variant}` as any;
      }
      return args.variant;
    };

    const getBorderRadiusStyle = () => {
      if (args.borderRadius === "none") return "0";
      if (args.borderRadius === "sm") return "0.2rem";
      if (args.borderRadius === "md") return "0.375rem";
      if (args.borderRadius === "lg") return "0.5rem";
      return "0.375rem";
    };

    const getFontSize = () => {
      if (args.fontSize === "sm") return "0.875rem";
      if (args.fontSize === "lg") return "1.125rem";
      return "0.9375rem";
    };

    const getFontWeight = () => {
      if (args.fontWeight === "medium") return "500";
      if (args.fontWeight === "bold") return "700";
      return "400";
    };

    const buttonStyle: React.CSSProperties = {
      backgroundColor: args.backgroundColor || undefined,
      color: args.textColor || undefined,
      borderColor: args.borderColor || undefined,
      borderRadius: getBorderRadiusStyle(),
      fontSize: getFontSize(),
      fontWeight: getFontWeight(),
      paddingLeft: `${args.paddingX}px`,
      paddingRight: `${args.paddingX}px`,
      paddingTop: `${args.paddingY}px`,
      paddingBottom: `${args.paddingY}px`,
      width: args.block ? "100%" : undefined,
    };

    const renderContent = () => {
      if (args.loading) {
        return <Spinner animation="border" size="sm" />;
      }

      const iconElement = IconComponent ? (
        <IconComponent size={args.iconSize} style={{ marginRight: args.iconPosition === "left" ? "0.5rem" : 0, marginLeft: args.iconPosition === "right" ? "0.5rem" : 0 }} />
      ) : null;

      if (args.iconPosition === "left" && iconElement) {
        return (
          <>
            {iconElement}
            {args.text}
          </>
        );
      }

      if (args.iconPosition === "right" && iconElement) {
        return (
          <>
            {args.text}
            {iconElement}
          </>
        );
      }

      return args.text;
    };

    return (
      <Button
        variant={getVariant()}
        size={args.size}
        active={args.active}
        disabled={args.disabled}
        style={buttonStyle}
        className={args.block ? "d-block w-100" : ""}
      >
        {renderContent()}
      </Button>
    );
  },
};

export const AllVariants: Story = {
  render: () => {
    const variants = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark", "link"] as const;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {variants.map((variant) => (
          <Button key={variant} variant={variant} className="me-1 mb-2">
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Button>
        ))}
      </div>
    );
  },
};

export const OutlineButtons: Story = {
  render: () => {
    const variants = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"] as const;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {variants.map((variant) => (
          <Button key={variant} variant={`outline-${variant}` as any} className="me-1 mb-2">
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Button>
        ))}
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        <Button variant="primary" size="lg" className="me-1">
          Large button
        </Button>
        <Button variant="primary" className="me-1">
          Default button
        </Button>
        <Button variant="primary" size="sm" className="me-1">
          Small button
        </Button>
      </div>
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <Button variant="primary" className="me-1">
          <ShoppingBag size={18} style={{ marginRight: "0.5rem" }} />
          Your Text Goes Here
        </Button>
        <Button variant="primary" className="me-1">
          <Plus size={18} />
        </Button>
        <Button variant="primary" className="me-1">
          <Spinner animation="border" size="sm" />
        </Button>
        <Button variant="primary" size="lg" className="me-1">
          <Plus size={18} />
        </Button>
        <Button variant="primary" className="me-1">
          <Plus size={18} />
        </Button>
        <Button variant="primary" size="sm" className="me-1">
          <Plus size={18} />
        </Button>
      </div>
    );
  },
};

export const States: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <Button variant="primary" active className="me-1">
          Active button
        </Button>
        <Button variant="primary" disabled className="me-1">
          Disabled button
        </Button>
        <Button variant="primary" className="me-1">
          <Spinner animation="border" size="sm" style={{ marginRight: "0.5rem" }} />
          Loading...
        </Button>
      </div>
    );
  },
};

export const BlockButton: Story = {
  render: () => {
    return (
      <div style={{ maxWidth: "400px" }}>
        <div className="d-grid gap-2">
          <Button variant="primary">Button</Button>
          <Button variant="primary">Button</Button>
        </div>
      </div>
    );
  },
};



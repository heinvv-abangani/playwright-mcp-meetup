import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "react-bootstrap";
import React, { useState, useEffect, useMemo } from "react";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Build vertically collapsing accordions in combination with the Collapse component.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    flush: {
      control: "boolean",
      description: "Remove the default background-color, some borders, and some rounded corners",
      table: {
        category: "Variant",
      },
    },
    alwaysOpen: {
      control: "boolean",
      description: "Allow multiple items to be open simultaneously",
      table: {
        category: "Variant",
      },
    },
    defaultActiveKey: {
      control: "text",
      description: "Default active accordion item key",
      table: {
        category: "Variant",
      },
    },
    numberOfItems: {
      control: { type: "number", min: 1, max: 10, step: 1 },
      description: "Number of accordion items",
      table: {
        category: "Content",
      },
    },
    itemTitles: {
      control: "object",
      description: "Array of accordion item titles",
      table: {
        category: "Content",
      },
    },
    itemContents: {
      control: "object",
      description: "Array of accordion item contents",
      table: {
        category: "Content",
      },
    },
    headerBackgroundColor: {
      control: "color",
      description: "Header background color",
      table: {
        category: "Styling",
      },
    },
    headerTextColor: {
      control: "color",
      description: "Header text color",
      table: {
        category: "Styling",
      },
    },
    bodyBackgroundColor: {
      control: "color",
      description: "Body background color",
      table: {
        category: "Styling",
      },
    },
    bodyTextColor: {
      control: "color",
      description: "Body text color",
      table: {
        category: "Styling",
      },
    },
    borderColor: {
      control: "color",
      description: "Border color",
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
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const defaultTitles = [
  "Accordion Item #1",
  "Accordion Item #2",
  "Accordion Item #3",
];

const defaultContents = [
  "This is the accordion body of item 1. It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element.",
  "This is the accordion body of item 2. These classes control the overall appearance, as well as the showing and hiding via CSS transitions.",
  "This is the accordion body of item 3. You can modify any of this with custom CSS or overriding our default variables.",
];

const AccordionWrapper = (args: any) => {
  const [activeKey, setActiveKey] = useState<string | undefined>(args.defaultActiveKey);
  const items = Array.from({ length: args.numberOfItems || 3 }, (_, i) => i);
  const titles = args.itemTitles || defaultTitles;
  const contents = args.itemContents || defaultContents;
  const wrapperId = useMemo(() => `accordion-story-${Math.random().toString(36).substr(2, 9)}`, []);
  const styleId = `${wrapperId}-style`;

  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    const headerBg = args.headerBackgroundColor || '#624bff';
    const headerColor = args.headerTextColor || '#ffffff';
    const bodyBg = args.bodyBackgroundColor || '#ffffff';
    const bodyColor = args.bodyTextColor || '#637381';

    const css = `#${wrapperId} .accordion-button{background-color:${headerBg}!important;color:${headerColor}!important}#${wrapperId} .accordion-button:not(.collapsed){background-color:${headerBg}!important;color:${headerColor}!important}#${wrapperId} .accordion-button:hover{background-color:${headerBg}!important;color:${headerColor}!important}#${wrapperId} .accordion-button:focus{background-color:${headerBg}!important;color:${headerColor}!important;box-shadow:0 0 0 0.25rem rgba(98,75,255,0.25)}#${wrapperId} .accordion-body{background-color:${bodyBg}!important;color:${bodyColor}!important}`;
    
    if (styleElement.textContent !== css) {
      styleElement.textContent = css;
    }
  }, [wrapperId, styleId, args.headerBackgroundColor, args.headerTextColor, args.bodyBackgroundColor, args.bodyTextColor]);

  const getBorderRadiusClass = () => {
    if (args.borderRadius === "none") return "";
    if (args.borderRadius === "sm") return "rounded-1";
    if (args.borderRadius === "md") return "rounded";
    if (args.borderRadius === "lg") return "rounded-2";
    return "rounded";
  };

  const getFontSizeClass = () => {
    if (args.fontSize === "sm") return "fs-6";
    if (args.fontSize === "lg") return "fs-4";
    return "";
  };

  const getFontWeightClass = () => {
    if (args.fontWeight === "medium") return "fw-medium";
    if (args.fontWeight === "bold") return "fw-bold";
    return "fw-normal";
  };

  return (
    <div id={wrapperId} style={{ maxWidth: "800px" }}>
      <Accordion
        activeKey={activeKey}
        onSelect={(key) => setActiveKey(key === activeKey ? undefined : (key as string))}
        flush={args.flush}
        defaultActiveKey={args.defaultActiveKey}
      >
        {items.map((index) => (
          <Accordion.Item
            key={index}
            eventKey={index.toString()}
            style={{
              borderColor: args.borderColor,
              borderRadius: args.borderRadius === "none" ? "0" : undefined,
            }}
            className={getBorderRadiusClass()}
          >
            <Accordion.Header
              style={{
                fontSize: args.fontSize === "sm" ? "0.875rem" : args.fontSize === "lg" ? "1.25rem" : "0.9375rem",
                fontWeight: args.fontWeight === "medium" ? "500" : args.fontWeight === "bold" ? "700" : "400",
              }}
              className={`${getFontSizeClass()} ${getFontWeightClass()}`}
            >
              {titles[index] || `Accordion Item #${index + 1}`}
            </Accordion.Header>
            <Accordion.Body
              style={{
                fontSize: args.fontSize === "sm" ? "0.875rem" : args.fontSize === "lg" ? "1.25rem" : "0.9375rem",
                fontWeight: args.fontWeight === "medium" ? "500" : args.fontWeight === "bold" ? "700" : "400",
              }}
              className={`${getFontSizeClass()} ${getFontWeightClass()}`}
            >
              <strong>{contents[index]?.split(".")[0]}.</strong> {contents[index]?.substring(contents[index].indexOf(".") + 1) || contents[index]}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export const Basic: Story = {
  args: {
    flush: false,
    alwaysOpen: false,
    defaultActiveKey: "0",
    numberOfItems: 3,
    itemTitles: defaultTitles,
    itemContents: defaultContents,
    headerBackgroundColor: "#624bff",
    headerTextColor: "#ffffff",
    bodyBackgroundColor: "#ffffff",
    bodyTextColor: "#637381",
    borderColor: "#dfe3e8",
    borderRadius: "md",
    fontSize: "base",
    fontWeight: "normal",
  },
  render: (args) => <AccordionWrapper {...args} />,
};

export const Flush: Story = {
  args: {
    ...Basic.args,
    flush: true,
  },
  render: Basic.render,
};

export const SingleItem: Story = {
  args: {
    ...Basic.args,
    numberOfItems: 1,
    itemTitles: ["Single Accordion Item"],
    itemContents: ["This is a single accordion item example."],
  },
  render: Basic.render,
};


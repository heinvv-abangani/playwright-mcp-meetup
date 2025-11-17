# Product Requirements Document: Storybook Implementation for Accordions and Buttons

## Overview

This PRD outlines the requirements for implementing Storybook to document and test the Accordion and Button components from the DashUI React application. The Storybook will provide interactive controls to modify component styling, variants, and behavior.

## Objectives

1. Set up Storybook in the existing React + Vite + TypeScript project
2. Create stories for Accordion and Button components
3. Implement comprehensive controls for styling customization
4. Document all component variants and options
5. Enable interactive testing and design exploration

## Target Components

### Accordions
- **Source**: `src/bootstrap-components/Accordions.tsx`
- **URL**: `http://localhost:5173/components/accordions`
- **Base Component**: React Bootstrap `Accordion`
- **Variants**: Basic, Flush

### Buttons
- **Source**: `src/bootstrap-components/Buttons.tsx`
- **URL**: `http://localhost:5173/components/buttons`
- **Base Component**: React Bootstrap `Button`
- **Variants**: Regular, Outline, Sizes, Block, Icons, States (Active/Disabled/Toggle)

## Technical Decisions (Defaults)

### Storybook Setup

- **Version**: Latest stable Storybook v7.x with Vite builder
- **Configuration**: `.storybook/` directory in project root
- **Story Files**: TypeScript (.tsx) files co-located with components in `src/bootstrap-components/`
- **Port**: Default 6006
- **Script**: `npm run storybook` for development, `npm run build-storybook` for build

### Dependencies & Integration

- **Bootstrap**: Use same React Bootstrap setup as main app
- **Styles**: Import existing SCSS theme files (`src/styles/theme.scss`)
- **Routing**: Isolated from main app routing (no react-router needed in Storybook)
- **Components**: Use React Bootstrap components directly (no wrapper components needed)

### Story Organization

- **Structure**: One story file per component (`Accordion.stories.tsx`, `Button.stories.tsx`)
- **Hierarchy**: Use Storybook's component hierarchy (`Components/Accordion/Basic`, `Components/Button/Primary`)
- **Naming**: Descriptive names matching demo page structure
- **Location**: Co-located with components: `src/bootstrap-components/Accordion.stories.tsx`

### Required Addons

- `@storybook/addon-controls` - Interactive controls (default)
- `@storybook/addon-actions` - Event logging
- `@storybook/addon-docs` - Documentation
- `@storybook/addon-viewport` - Responsive testing
- `@storybook/addon-backgrounds` - Background color testing

## Controls & Styling Requirements

### Accordion Controls

#### Variant Controls
- **Flush**: Boolean toggle (default: false)
- **Always Open**: Boolean toggle (default: false)
- **Default Active Key**: Text input (default: "0")

#### Content Controls
- **Number of Items**: Number input (default: 3, range: 1-10)
- **Item Titles**: Array of text inputs (editable)
- **Item Content**: Array of text inputs (editable)

#### Styling Controls
- **Header Background Color**: Color picker (default: Bootstrap primary)
- **Header Text Color**: Color picker (default: Bootstrap text color)
- **Body Background Color**: Color picker (default: white)
- **Body Text Color**: Color picker (default: Bootstrap text color)
- **Border Color**: Color picker (default: Bootstrap border color)
- **Border Radius**: Select dropdown (none, sm, md, lg - from theme)
- **Font Size**: Select dropdown (sm, base, lg - from theme)
- **Font Weight**: Select dropdown (normal, medium, bold - from theme)

### Button Controls

#### Variant Controls
- **Variant**: Select dropdown (primary, secondary, success, danger, warning, info, light, dark, link)
- **Outline**: Boolean toggle (default: false)
- **Size**: Select dropdown (sm, default, lg)
- **Block**: Boolean toggle (default: false)

#### Content Controls
- **Text**: Text input (default: "Button")
- **Icon**: Select dropdown (none, ShoppingBag, Plus, Check, etc. from react-feather)
- **Icon Position**: Select dropdown (left, right)
- **Icon Size**: Number input (default: 18, range: 12-24)

#### State Controls
- **Active**: Boolean toggle (default: false)
- **Disabled**: Boolean toggle (default: false)
- **Loading**: Boolean toggle (default: false, shows spinner)

#### Styling Controls
- **Background Color**: Color picker (default: variant color)
- **Text Color**: Color picker (default: white for solid, variant color for outline)
- **Border Color**: Color picker (default: variant color)
- **Border Radius**: Select dropdown (none, sm, md, lg - from theme)
- **Font Size**: Select dropdown (sm, base, lg - from theme)
- **Font Weight**: Select dropdown (normal, medium, bold - from theme)
- **Padding X**: Number input (default: 16, range: 8-32)
- **Padding Y**: Number input (default: 8, range: 4-16)

## Story Structure

### Accordion Stories

1. **Basic Accordion**
   - Default accordion with 3 items
   - All styling controls available

2. **Flush Accordion**
   - Flush variant enabled
   - All styling controls available

3. **Single Item Accordion**
   - One accordion item
   - Simplified controls

### Button Stories

1. **Primary Button**
   - Default primary button
   - All controls available

2. **All Variants**
   - Grid showing all button variants
   - Variant selector control

3. **Sizes**
   - All button sizes displayed
   - Size selector control

4. **With Icons**
   - Button with icon examples
   - Icon controls available

5. **States**
   - Active, disabled, loading states
   - State toggles available

## Implementation Details

### Control Types

- **Color**: `color` control type (hex color picker)
- **Select**: `select` control type (dropdown)
- **Text**: `text` control type (text input)
- **Number**: `number` control type (number input with min/max)
- **Boolean**: `boolean` control type (toggle switch)

### Styling Application

- **Method**: Inline styles via `style` prop for custom values
- **Bootstrap Classes**: Use React Bootstrap props (variant, size, etc.) for standard options
- **Custom Styles**: Apply via inline styles when Bootstrap classes don't cover the need
- **Theme Colors**: Use color picker with Bootstrap theme colors as presets

### Control Organization

- **Grouping**: Controls organized by category using `argTypes` table
- **Categories**: Variant, Content, State, Styling
- **Documentation**: Each control has description in `argTypes`

## File Structure

```
playwright-mcp-meetup/
├── .storybook/
│   ├── main.ts
│   ├── preview.ts
│   └── preview-head.html (for SCSS imports)
├── src/
│   └── bootstrap-components/
│       ├── Accordion.stories.tsx
│       ├── Button.stories.tsx
│       ├── Accordions.tsx (existing)
│       └── Buttons.tsx (existing)
└── package.json
```

## Questions & Open Decisions

### 1. Icon Library
- **Question**: Should we support both react-feather and react-bootstrap-icons, or just react-feather?
- **Default**: Start with react-feather only (already in dependencies)

### 2. Custom Color Presets
- **Question**: Should color picker include Bootstrap theme color presets as quick-select options?
- **Default**: Yes, include theme colors from `_variables.scss` as presets

### 3. Code Examples
- **Question**: Should each story include copyable code examples showing the component usage?
- **Default**: Yes, use Storybook's Docs addon to auto-generate code examples

### 4. Responsive Testing
- **Question**: Should we include viewport controls for testing responsive behavior?
- **Default**: Yes, use viewport addon with common breakpoints

### 5. Accessibility Testing
- **Question**: Should we include accessibility addon (a11y) for testing?
- **Default**: Not initially, can be added later if needed

### 6. Multiple Accordion Items Control
- **Question**: Should users be able to dynamically add/remove accordion items, or fixed number?
- **Default**: Fixed number (3) with editable content, can expand later

### 7. Story Documentation
- **Question**: What level of documentation detail is needed?
- **Default**: Basic usage examples and prop descriptions, can expand later

## Success Criteria

1. ✅ Storybook runs successfully on localhost:6006
2. ✅ Accordion component has stories with Basic and Flush variants
3. ✅ Button component has stories with all variants (Regular, Outline, Sizes, Block, Icons, States)
4. ✅ All styling properties are controllable via Storybook controls
5. ✅ Controls are intuitive and well-organized
6. ✅ Component documentation is clear and helpful
7. ✅ Stories match the behavior of components in the main app
8. ✅ Storybook build completes without errors
9. ✅ No performance issues when using controls
10. ✅ Code examples are accurate and copyable

## Out of Scope (For Now)

- Other components beyond Accordions and Buttons
- Storybook deployment/hosting
- Visual regression testing setup
- Automated testing integration
- Design system documentation beyond components
- Component composition examples
- Advanced accessibility testing
- Custom control components

## Implementation Steps

1. **Install Storybook**
   - Run `npx storybook@latest init` with Vite builder
   - Configure for TypeScript and React

2. **Configure Storybook**
   - Set up `.storybook/main.ts` with Vite builder
   - Configure `.storybook/preview.ts` to import SCSS theme
   - Add required addons

3. **Create Accordion Stories**
   - Extract Accordion examples from `Accordions.tsx`
   - Create `Accordion.stories.tsx` with Basic and Flush stories
   - Add controls for variant, content, and styling

4. **Create Button Stories**
   - Extract Button examples from `Buttons.tsx`
   - Create `Button.stories.tsx` with all variant stories
   - Add controls for variant, content, state, and styling

5. **Test & Refine**
   - Test all controls work correctly
   - Verify styling applies properly
   - Ensure code examples are accurate
   - Test responsive behavior

6. **Documentation**
   - Add descriptions to stories
   - Document control usage
   - Add usage guidelines

## Dependencies to Add

```json
{
  "devDependencies": {
    "@storybook/addon-actions": "^7.x",
    "@storybook/addon-controls": "^7.x",
    "@storybook/addon-docs": "^7.x",
    "@storybook/addon-viewport": "^7.x",
    "@storybook/addon-backgrounds": "^7.x",
    "@storybook/react": "^7.x",
    "@storybook/react-vite": "^7.x",
    "storybook": "^7.x"
  }
}
```

## References

- [Storybook Documentation](https://storybook.js.org/docs)
- [Storybook with Vite](https://storybook.js.org/docs/react/builders/vite)
- [React Bootstrap Accordion](https://react-bootstrap.github.io/docs/components/accordion)
- [React Bootstrap Button](https://react-bootstrap.github.io/docs/components/button)
- Project SCSS Variables: `src/styles/theme/_variables.scss`
- Component Source: `src/bootstrap-components/`

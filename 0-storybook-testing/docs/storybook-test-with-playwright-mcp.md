# Storybook Testing with Playwright MCP

## Investigation Findings

### Phase 1: Discovery Using Playwright MCP Browser Extension

Using the Chrome DevTools MCP browser extension, we investigated the Storybook Accordion component page to identify all available color controls.

**Investigation Steps:**
1. Navigated to `http://localhost:6006/?path=/story/components-accordion--basic`
2. Captured page snapshot to analyze DOM structure
3. Identified controls panel structure and color input elements
4. Verified preview iframe structure and accordion component elements

### Discovered Color Controls

The investigation revealed **5 color controls** available in the Storybook controls panel:

| Control Name | Target Element | CSS Property | Default Value |
|-------------|----------------|--------------|---------------|
| `headerBackgroundColor` | `.accordion-button` | `backgroundColor` | `#624bff` |
| `headerTextColor` | `.accordion-button` | `color` | `#ffffff` |
| `bodyBackgroundColor` | `.accordion-body` | `backgroundColor` | `#ffffff` |
| `bodyTextColor` | `.accordion-body` | `color` | `#637381` |
| `borderColor` | `.accordion-item` | `borderColor` | `#dfe3e8` |

**Control Panel Structure:**
- Controls are organized in a table with rows for each control
- Each color control has a textbox input with placeholder "Choose color..."
- Controls are grouped under the "Styling" category
- Color inputs are located using: `tr:has-text("${controlName}") input[placeholder*="Choose color"]`

**Preview Structure:**
- Preview is rendered inside an iframe with selector `iframe[id*="storybook-preview"]`
- Accordion component uses Bootstrap classes: `.accordion`, `.accordion-button`, `.accordion-body`, `.accordion-item`
- First accordion item is expanded by default (`defaultActiveKey: "0"`)

## Implementation

### Test Strategy

Implemented a comprehensive test that:
1. **Tests all color controls** in a single test using a data-driven approach
2. **Uses screenshot assertions** to verify visual changes
3. **Validates computed styles** to ensure colors are applied correctly
4. **Handles accordion state** to ensure body elements are visible for testing

### Key Implementation Details

#### 1. Data-Driven Test Structure

```typescript
const COLOR_CONTROLS = [
  {
    name: 'headerBackgroundColor',
    testColor: '#ff0000',
    expectedRgb: 'rgb(255, 0, 0)',
    targetSelector: '.accordion-button',
    property: 'backgroundColor',
  },
  // ... 4 more controls
];
```

Each control configuration includes:
- `name`: Control identifier in Storybook
- `testColor`: Hex color value to test
- `expectedRgb`: Expected RGB value for assertion
- `targetSelector`: CSS selector for the element that receives the color
- `property`: CSS property name to verify

#### 2. Screenshot Testing Approach

The test captures screenshots at multiple stages:

1. **Initial State**: Before any changes
2. **Before Each Control**: Before changing each color control
3. **After Each Control**: After changing each color control
4. **Final State**: After all color changes

**Screenshot Assertions:**
- Uses Playwright's `toMatchSnapshot()` for visual regression testing
- Compares screenshots to detect visual changes
- Verifies screenshots differ before/after each change

#### 3. Accordion State Management

The test ensures the accordion body is visible before testing body colors:

```typescript
const isCollapsed = await accordionButton.evaluate((el) => {
  return el.classList.contains('collapsed');
});

if (isCollapsed) {
  await accordionButton.click();
  await page.waitForTimeout(300);
}
```

This ensures:
- Body background color tests can verify the background
- Body text color tests can verify the text color
- Screenshots capture the full accordion state

#### 4. Style Verification

For each color control, the test:
1. Locates the control input in the controls panel
2. Changes the color value
3. Waits for the change to apply (500ms)
4. Verifies the computed style matches the expected RGB value
5. Captures screenshot to verify visual change

**Computed Style Verification:**
```typescript
const computedStyle = await targetElement.evaluate((el, prop) => {
  return window.getComputedStyle(el)[prop as keyof CSSStyleDeclaration] as string;
}, control.property);

expect(computedStyle).toBe(control.expectedRgb);
```

## Test Execution

### Running the Test

```bash
npx playwright test accordion.storybook.spec.ts
```

### First Run Behavior

On the first run, Playwright will:
1. Generate snapshot images for all screenshot assertions
2. Store them in `tests/__snapshots__/` directory
3. All assertions will pass (no baseline exists yet)

### Subsequent Runs

On subsequent runs, Playwright will:
1. Compare new screenshots against stored snapshots
2. Fail if visual differences are detected
3. Generate diff images showing what changed

### Snapshot Files Generated

The test generates the following snapshot files:
- `accordion-initial-state.png`
- `accordion-before-headerBackgroundColor.png`
- `accordion-after-headerBackgroundColor.png`
- `accordion-before-headerTextColor.png`
- `accordion-after-headerTextColor.png`
- `accordion-before-bodyBackgroundColor.png`
- `accordion-after-bodyBackgroundColor.png`
- `accordion-before-bodyTextColor.png`
- `accordion-after-bodyTextColor.png`
- `accordion-before-borderColor.png`
- `accordion-after-borderColor.png`
- `accordion-final-state.png`

## Benefits of This Approach

1. **Comprehensive Coverage**: Tests all color controls in a single, maintainable test
2. **Visual Regression**: Screenshot testing catches visual bugs that unit tests might miss
3. **Evidence-Based**: Uses Playwright MCP to investigate actual behavior before writing tests
4. **Maintainable**: Data-driven structure makes it easy to add/remove controls
5. **Reliable**: Verifies both computed styles and visual appearance

## Lessons Learned

### Investigation First

Following the workspace rule to investigate before writing tests:
- Used Chrome DevTools MCP to explore the actual page structure
- Identified all color controls through DOM inspection
- Verified element selectors and control locations
- Confirmed accordion state behavior

### Screenshot Testing Considerations

- Screenshots capture the entire accordion container, not individual elements
- Timing is important: wait for color changes to apply before capturing
- Accordion state (expanded/collapsed) affects what's visible in screenshots
- Screenshot comparison is pixel-perfect, so consistent rendering is critical

### Iframe Handling

- Storybook preview is in an iframe, requiring `frameLocator()` usage
- Controls panel is in the main page, not the iframe
- Need to switch between main page and iframe contexts appropriately

## Future Enhancements

Potential improvements:
1. Test other control types (borderRadius, fontSize, fontWeight)
2. Test multiple accordion items
3. Test accordion interactions (expand/collapse)
4. Add visual diff threshold configuration for screenshot comparison
5. Test responsive behavior at different viewport sizes


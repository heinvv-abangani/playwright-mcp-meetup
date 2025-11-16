# ARIA Pattern Analysis: census.nl Primary Menu

**Date:** 2025-01-27  
**Tool Used:** Chrome DevTools MCP (Playwright Browser Extension)  
**Target:** https://census.nl primary navigation menu

## Executive Summary

The census.nl primary menu implements a **minimal ARIA pattern** that relies primarily on semantic HTML with basic accessibility features. While the menu uses proper semantic elements and hides decorative icons, it lacks dynamic ARIA states for submenu interactions, which may impact screen reader users.

## Current Implementation

### Navigation Container

```html
<nav class="header__nav" aria-label="primair">
```

**Attributes:**
- `aria-label="primair"` ✅ (provides accessible name)
- No explicit `role` attribute (relies on implicit `<nav>` role) ✅
- Class: `header__nav`

**Analysis:**
- Uses semantic `<nav>` element with descriptive `aria-label`
- Implicit navigation landmark role is appropriate
- Properly identifies the navigation region for screen readers

### List Structure

```html
<ul>
  <!-- 31 menu items total -->
</ul>
```

**Attributes:**
- No `role` attribute (implicit list role) ✅
- No `aria-label` attribute
- No `id` attribute
- Contains 31 total `<li>` items, 7 with submenus

**Analysis:**
- Semantic `<ul>` provides implicit list role
- No additional labeling needed as navigation context is clear

### Menu Items with Submenus

**Structure Pattern:**
```html
<li class="menu-item first level1 has-children 16">
  <a href="https://census.nl/diensten/">Development</a>
  <img aria-hidden="true" src="/assets/templates/images/svg/icon-chevron-down.svg" width="13" height="8" alt="">
  <ul>
    <!-- submenu items -->
  </ul>
</li>
```

**Link Attributes (Parent Items with Submenus):**
- ❌ No `aria-expanded` attribute
- ❌ No `aria-haspopup` attribute
- ❌ No `aria-controls` attribute
- ❌ No `id` attribute
- ✅ Standard `href` attribute

**Submenu Attributes:**
- ❌ No `id` attribute
- ❌ No `aria-hidden` attribute (though CSS hides with `display: none`)
- ❌ No `aria-labelledby` attribute
- No class names

**Decorative Icons:**
- ✅ `<img aria-hidden="true">` - properly hidden from assistive technology
- ✅ Empty `alt=""` attribute (redundant but acceptable)

## Accessibility Features Present

### ✅ What's Working Well

1. **Semantic HTML Structure**
   - Uses proper `<nav>`, `<ul>`, `<li>`, and `<a>` elements
   - Implicit ARIA roles from semantic elements
   - Clear hierarchical structure

2. **Navigation Identification**
   - `aria-label="primair"` clearly identifies the navigation region
   - Screen readers can announce "Primary navigation" or similar

3. **Decorative Content Handling**
   - Chevron icons properly marked with `aria-hidden="true"`
   - Prevents screen readers from announcing decorative elements

4. **CSS-Based Submenu Display**
   - Submenus use `display: none` when hidden
   - Visual state management through CSS

## Missing ARIA Features

### ❌ Critical Missing Attributes

1. **No `aria-expanded` on Parent Links**
   - **Impact:** Screen reader users cannot determine if submenus are open or closed
   - **Should be:** `aria-expanded="false"` when closed, `aria-expanded="true"` when open
   - **Dynamic:** Should update on hover/focus/interaction

2. **No `aria-haspopup` on Parent Links**
   - **Impact:** Screen readers don't know that clicking/hovering will reveal additional content
   - **Should be:** `aria-haspopup="true"` or `aria-haspopup="menu"`

3. **No `aria-controls` Relationship**
   - **Impact:** No programmatic link between parent link and its submenu
   - **Should be:** `aria-controls="submenu-development"` pointing to submenu `id`

4. **No IDs on Submenus**
   - **Impact:** Cannot establish `aria-controls` relationships
   - **Should be:** Unique `id` on each `<ul>` submenu (e.g., `id="submenu-development"`)

5. **No `aria-labelledby` on Submenus**
   - **Impact:** Submenus not explicitly labeled by their parent link
   - **Should be:** `aria-labelledby="menu-development"` referencing parent link `id`

6. **No `aria-hidden` on Hidden Submenus**
   - **Impact:** While CSS `display: none` hides visually, explicit `aria-hidden="true"` is clearer for assistive tech
   - **Should be:** `aria-hidden="true"` when closed, removed when open

## Recommended ARIA Pattern

### Complete Implementation Example

```html
<nav class="header__nav" aria-label="primair">
  <ul>
    <li class="menu-item first level1 has-children">
      <a href="https://census.nl/diensten/"
         id="menu-development"
         aria-expanded="false"
         aria-haspopup="true"
         aria-controls="submenu-development">
        Development
      </a>
      <img aria-hidden="true" 
           src="/assets/templates/images/svg/icon-chevron-down.svg" 
           width="13" 
           height="8" 
           alt="">
      <ul id="submenu-development"
          aria-labelledby="menu-development"
          aria-hidden="true">
        <li class="menu-item first level2 has-children">
          <a href="https://census.nl/webdevelopment/"
             id="menu-webdevelopment"
             aria-expanded="false"
             aria-haspopup="true"
             aria-controls="submenu-webdevelopment">
            Webdevelopment
          </a>
          <img aria-hidden="true" src="..." alt="">
          <ul id="submenu-webdevelopment"
              aria-labelledby="menu-webdevelopment"
              aria-hidden="true">
            <!-- nested submenu items -->
          </ul>
        </li>
        <!-- more submenu items -->
      </ul>
    </li>
    <!-- more menu items -->
  </ul>
</nav>
```

### JavaScript Requirements

To make this fully functional, JavaScript should:

1. **Update `aria-expanded` on interaction:**
   ```javascript
   // On hover/focus/click
   link.setAttribute('aria-expanded', 'true');
   submenu.removeAttribute('aria-hidden');
   
   // On blur/close
   link.setAttribute('aria-expanded', 'false');
   submenu.setAttribute('aria-hidden', 'true');
   ```

2. **Handle keyboard navigation:**
   - Arrow keys to navigate menu items
   - Enter/Space to activate
   - Escape to close submenus
   - Tab to move through menu items

## Testing Methodology

### Tools Used

1. **Chrome DevTools MCP Browser Extension**
   - Navigated to https://census.nl
   - Captured page snapshot for structure analysis
   - Evaluated JavaScript to inspect ARIA attributes
   - Checked computed styles for submenu visibility

### Verification Steps

1. ✅ Identified navigation element with `aria-label="primair"`
2. ✅ Confirmed semantic HTML structure (`nav` > `ul` > `li` > `a`)
3. ✅ Verified decorative icons have `aria-hidden="true"`
4. ❌ Confirmed missing `aria-expanded` on parent links
5. ❌ Confirmed missing `aria-haspopup` on parent links
6. ❌ Confirmed missing `aria-controls` relationships
7. ❌ Confirmed missing IDs on submenus
8. ✅ Verified submenus use CSS `display: none` for hiding

### Menu Statistics

- **Total menu items:** 31
- **Items with submenus:** 7
- **Nested submenu levels:** Up to 3 levels deep
- **Submenu display method:** CSS `display: none` (not `aria-hidden`)

## WCAG Compliance Assessment

### WCAG 2.1 Level AA Considerations

1. **4.1.2 Name, Role, Value (Level A)**
   - ⚠️ **Partial:** Names and roles present, but values (expanded state) missing
   - **Issue:** Screen readers cannot determine submenu state

2. **2.1.1 Keyboard (Level A)**
   - ❓ **Unknown:** Requires testing with keyboard navigation
   - **Potential Issue:** May rely on hover-only interaction

3. **2.4.6 Headings and Labels (Level AA)**
   - ✅ **Pass:** Navigation properly labeled with `aria-label`

4. **4.1.3 Status Messages (Level AA)**
   - ⚠️ **Partial:** Submenu state changes not announced
   - **Issue:** No live region or status updates for submenu open/close

## Impact on Users

### Screen Reader Users
- ❌ Cannot determine if submenus are available
- ❌ Cannot know if submenus are open or closed
- ❌ No clear relationship between parent links and submenus
- ✅ Can navigate menu items sequentially
- ✅ Navigation region is clearly identified

### Keyboard Users
- ❓ Unknown (requires testing)
- **Potential Issues:**
  - May require mouse hover to reveal submenus
  - No keyboard shortcuts for submenu navigation
  - Tab order may skip submenu items

### Mouse Users
- ✅ Full functionality available
- ✅ Visual indicators (chevron icons) present
- ✅ Hover states work as expected

## Recommendations

### Priority 1: Critical Accessibility Fixes

1. **Add `aria-expanded` to all parent links**
   - Update dynamically on hover/focus/click
   - Start with `aria-expanded="false"` in HTML

2. **Add `aria-haspopup="true"` to parent links**
   - Indicates that interaction reveals additional content

3. **Add unique IDs to all submenus**
   - Format: `id="submenu-{parent-link-text}"`

4. **Add `aria-controls` to parent links**
   - Link to corresponding submenu ID

### Priority 2: Enhanced Accessibility

5. **Add `aria-labelledby` to submenus**
   - Reference parent link ID for context

6. **Add `aria-hidden` to hidden submenus**
   - Set to `true` when closed, remove when open
   - Works alongside CSS `display: none`

7. **Implement keyboard navigation**
   - Arrow keys for menu navigation
   - Enter/Space for activation
   - Escape for closing submenus

### Priority 3: Advanced Features

8. **Add live region announcements**
   - Announce when submenus open/close
   - Use `aria-live="polite"` for status updates

9. **Add skip navigation link**
   - Allow users to skip directly to main content

10. **Test with actual screen readers**
    - NVDA, JAWS, VoiceOver
    - Verify all interactions work as expected

## Conclusion

The census.nl primary menu demonstrates **good semantic HTML practices** but falls short of **complete ARIA implementation** for accessible submenu interactions. The menu is functional for mouse users but may present barriers for screen reader and keyboard users due to missing ARIA states and relationships.

**Overall Assessment:** ⚠️ **Partially Accessible** - Works for basic navigation but lacks dynamic state management for submenus.

**Recommendation:** Implement the Priority 1 fixes to achieve WCAG 2.1 Level AA compliance for menu interactions.


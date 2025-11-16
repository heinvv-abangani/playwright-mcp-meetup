# Elementor Editor API Analysis

## Overview

This document maps the API structure of the Elementor page builder editor, focusing on endpoints used for adding content (widgets) and saving/publishing pages.

**Base URL**: `http://elementor.local:10003`

**Editor URL Pattern**: `/wp-admin/post.php?post={post_id}&action=elementor`

## Authentication

All API endpoints require WordPress authentication via cookies (logged-in user session).

## API Endpoints

### 1. Save Document (Primary Save/Publish Endpoint)

**Endpoint**: `POST /wp-admin/admin-ajax.php`

**Action**: `save_builder`

**Description**: Saves or publishes an Elementor document (page/post). This is the main endpoint used when clicking "Save" or "Publish" in the editor.

**Request Parameters**:

```json
{
  "action": "save_builder",
  "editor_post_id": 62222,
  "status": "publish",
  "elements": [
    {
      "id": "abc123",
      "elType": "widget",
      "widgetType": "e-div-block",
      "settings": {},
      "elements": []
    }
  ],
  "settings": {
    "template": "default"
  },
  "_nonce": "wp-nonce-value"
}
```

**Response**:

```json
{
  "status": "publish",
  "config": {
    "document": {
      "last_edited": "2025-11-16 21:36:00",
      "urls": {
        "wp_preview": "http://elementor.local:10003/?p=62222&preview=true"
      },
      "status": {
        "value": "publish",
        "label": "Published"
      }
    }
  }
}
```

**Status Values**:
- `publish` - Publish the page
- `draft` - Save as draft
- `private` - Save as private
- `pending` - Save as pending review
- `autosave` - Auto-save (creates revision)

### 2. Get Document Configuration

**Endpoint**: `POST /wp-admin/admin-ajax.php`

**Action**: `get_document_config`

**Description**: Retrieves the current document configuration including elements, settings, and metadata.

**Request Parameters**:

```json
{
  "action": "get_document_config",
  "id": 62222
}
```

### 3. Global Classes API

#### Get Global Classes

**Endpoint**: `GET /wp-json/elementor/v1/global-classes`

**Query Parameters**:
- `context` (required): `preview` | `frontend`

**Description**: Retrieves all global CSS classes available in the editor.



#### Update Global Classes

**Endpoint**: `PUT /wp-json/elementor/v1/global-classes`

**Query Parameters**:
- `context` (required): `preview` | `frontend`

**Description**: Updates global CSS classes. Used when publishing changes to global classes.

**Request Body**:

```json
{
  "items": {
    "class-name": {
      "id": "class-name",
      "label": "class-name",
      "type": "class",
      "variants": [...]
    }
  }
}
```

**Response**:

```json
{
  "data": {
    "items": {...},
    "changes": {
      "added": ["class1", "class2"],
      "deleted": [],
      "modified": []
    }
  }
}
```

### 4. Variables API

**Endpoint**: `GET /wp-json/elementor/v1/variables/list`

**Description**: Retrieves CSS variables and design tokens available in the editor.

**Response**:

```json
{
  "data": {
    "variables": [...]
  }
}
```

### 5. Kit Elements Defaults

**Endpoint**: `GET /wp-json/elementor/v1/kit-elements-defaults`

**Description**: Retrieves default settings for kit elements (site-wide defaults).

**Response**:

```json
{
  "data": {
    "defaults": {...}
  }
}
```

### 6. User Data API

**Endpoint**: `GET /wp-json/elementor/v1/user-data/current-user`

**Query Parameters**:
- `context` (required): `edit`

**Description**: Retrieves current user data and preferences for the editor.

**Response**:

```json
{
  "data": {
    "user": {...},
    "preferences": {...}
  }
}
```

### 7. Checklist Progress API

**Endpoint**: `GET /wp-json/elementor/v1/checklist/user-progress`

**Description**: Retrieves user progress on the onboarding checklist.

**Response**:

```json
{
  "data": {
    "last_opened_timestamp": null,
    "first_closed_checklist_in_editor": true,
    "is_popup_minimized": false,
    "steps": {
      "add_logo": {
        "is_marked_completed": false,
        "is_immutable_completed": false
      }
    },
    "should_open_in_editor": false
  }
}
```

### 8. Site Navigation API

**Endpoint**: `GET /wp-json/elementor/v1/site-navigation/recent-posts`

**Query Parameters**:
- `posts_per_page` (optional): Number of posts to return (default: 6)
- `_locale` (optional): Locale code (default: `user`)

**Description**: Retrieves recently edited posts for the site navigation panel.

**Response**:

```json
{
  "data": {
    "posts": [...]
  }
}
```

### 9. Globals API

**Endpoint**: `GET /wp-json/elementor/v1/globals`

**Description**: Retrieves global settings (colors, typography, etc.).

**Response**:

```json
{
  "data": {
    "globals": {...}
  }
}
```

### 10. Document Media Import

**Endpoint**: `POST /wp-json/elementor/v1/documents/{id}/media/import`

**Path Parameters**:
- `id` (required): Post ID

**Description**: Imports media for a document.

**Request Body**: Empty (media is processed server-side)

**Response**:

```json
{
  "success": true,
  "document_saved": true
}
```

## Widget Addition Flow

Widgets are added client-side in the editor. The flow is:

1. **User clicks widget** in the Elements panel
2. **Widget is added to DOM** structure in the editor
3. **Widget settings panel opens** for configuration
4. **Changes are tracked** in editor state
5. **Save/Publish triggers** `save_builder` endpoint with complete `elements` array

### Widget Structure

When saving, widgets are represented in the `elements` array:

```json
{
  "id": "unique-widget-id",
  "elType": "widget",
  "widgetType": "e-heading",
  "settings": {
    "title": "This is a title",
    "size": "default",
    "tag": "h2"
  },
  "elements": []
}
```

**Common Widget Types**:
- `e-div-block` - Div block widget
- `e-heading` - Heading widget
- `e-paragraph` - Paragraph widget
- `e-button` - Button widget
- `e-image` - Image widget

## OpenAPI Specification

```yaml
openapi: 3.0.0
info:
  title: Elementor Editor API
  version: 1.0.0
  description: API endpoints for Elementor page builder editor

servers:
  - url: http://elementor.local:10003
    description: Local development server

paths:
  /wp-admin/admin-ajax.php:
    post:
      summary: Save Elementor document
      operationId: saveBuilder
      requestBody:
        required: true
        content:
          application/x-www-form-urlencoded:
            schema:
              type: object
              required:
                - action
                - editor_post_id
                - elements
              properties:
                action:
                  type: string
                  enum: [save_builder]
                editor_post_id:
                  type: integer
                  description: Post ID being edited
                status:
                  type: string
                  enum: [publish, draft, private, pending, autosave]
                  default: draft
                elements:
                  type: array
                  description: Array of widget/element objects
                  items:
                    type: object
                    properties:
                      id:
                        type: string
                      elType:
                        type: string
                        enum: [widget, section, column, container]
                      widgetType:
                        type: string
                      settings:
                        type: object
                      elements:
                        type: array
                settings:
                  type: object
                  description: Document-level settings
                _nonce:
                  type: string
                  description: WordPress nonce for security
      responses:
        '200':
          description: Document saved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                  config:
                    type: object
                    properties:
                      document:
                        type: object
                        properties:
                          last_edited:
                            type: string
                          urls:
                            type: object
                            properties:
                              wp_preview:
                                type: string

  /wp-json/elementor/v1/global-classes:
    get:
      summary: Get global CSS classes
      operationId: getGlobalClasses
      parameters:
        - name: context
          in: query
          required: true
          schema:
            type: string
            enum: [preview, frontend]
      responses:
        '200':
          description: Global classes retrieved
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: object
                    properties:
                      items:
                        type: object

    put:
      summary: Update global CSS classes
      operationId: updateGlobalClasses
      parameters:
        - name: context
          in: query
          required: true
          schema:
            type: string
            enum: [preview, frontend]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - items
              properties:
                items:
                  type: object
                  description: Map of class ID to class definition
      responses:
        '200':
          description: Global classes updated
        '400':
          description: Invalid request data

  /wp-json/elementor/v1/variables/list:
    get:
      summary: Get CSS variables list
      operationId: getVariables
      responses:
        '200':
          description: Variables retrieved
          content:
            application/json:
              schema:
                type: object

  /wp-json/elementor/v1/kit-elements-defaults:
    get:
      summary: Get kit elements defaults
      operationId: getKitDefaults
      responses:
        '200':
          description: Defaults retrieved
          content:
            application/json:
              schema:
                type: object

  /wp-json/elementor/v1/user-data/current-user:
    get:
      summary: Get current user data
      operationId: getCurrentUser
      parameters:
        - name: context
          in: query
          required: true
          schema:
            type: string
            enum: [edit]
      responses:
        '200':
          description: User data retrieved
          content:
            application/json:
              schema:
                type: object

  /wp-json/elementor/v1/checklist/user-progress:
    get:
      summary: Get checklist progress
      operationId: getChecklistProgress
      responses:
        '200':
          description: Checklist progress retrieved
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: object
                    properties:
                      steps:
                        type: object

  /wp-json/elementor/v1/site-navigation/recent-posts:
    get:
      summary: Get recent posts
      operationId: getRecentPosts
      parameters:
        - name: posts_per_page
          in: query
          schema:
            type: integer
            default: 6
        - name: _locale
          in: query
          schema:
            type: string
            default: user
      responses:
        '200':
          description: Recent posts retrieved
          content:
            application/json:
              schema:
                type: object

  /wp-json/elementor/v1/globals:
    get:
      summary: Get global settings
      operationId: getGlobals
      responses:
        '200':
          description: Globals retrieved
          content:
            application/json:
              schema:
                type: object

  /wp-json/elementor/v1/documents/{id}/media/import:
    post:
      summary: Import media for document
      operationId: importDocumentMedia
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Media imported successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  document_saved:
                    type: boolean
```

## Demo Flow Examples

### 1. Basic Navigation Demo

```javascript
// Navigate to Elementor editor
await page.goto('http://elementor.local:10003/wp-admin/post.php?post=62222&action=elementor');

// Wait for editor to load
await page.waitForSelector('.elementor-editor');

// Take screenshot of widgets panel
await page.screenshot({ path: 'widgets-panel.png' });
```

### 2. Interactive Testing - Add Heading Widget

```javascript
// Open Elementor editor
await page.goto('http://elementor.local:10003/wp-admin/post.php?post=62222&action=elementor');

// Click "Add Element" button
await page.click('button[aria-label="Add Element"]');

// Click Heading widget
await page.click('button:has-text("Heading")');

// Configure heading text
await page.fill('input[placeholder*="title"]', 'Demo Title');

// Save the page
await page.click('button:has-text("Publish")');

// Verify heading appears in preview
await page.waitForSelector('h2:has-text("Demo Title")');
```

### 3. API Contract Testing

```javascript
// Intercept API calls
const apiCalls = [];
page.on('request', request => {
  if (request.url().includes('admin-ajax.php') || request.url().includes('wp-json/elementor')) {
    apiCalls.push({
      url: request.url(),
      method: request.method(),
      headers: request.headers(),
      postData: request.postData()
    });
  }
});

page.on('response', response => {
  if (response.url().includes('admin-ajax.php') || response.url().includes('wp-json/elementor')) {
    const matchingCall = apiCalls.find(call => call.url === response.url());
    if (matchingCall) {
      matchingCall.status = response.status();
      response.json().then(data => {
        matchingCall.response = data;
      });
    }
  }
});

// Perform actions
await page.goto('http://elementor.local:10003/wp-admin/post.php?post=62222&action=elementor');
await page.click('button:has-text("Heading")');
await page.click('button:has-text("Publish")');

// Analyze API calls
console.log('API Calls:', JSON.stringify(apiCalls, null, 2));
```

## Notes

1. **Widget Addition**: Widgets are added client-side. The editor maintains state in memory until save/publish.

2. **Save vs Publish**: Both use the same endpoint with different `status` values.

3. **Auto-save**: Elementor automatically saves drafts periodically using `status: "autosave"`.

4. **Nonce Security**: All admin-ajax requests require a valid WordPress nonce.

5. **REST API vs Admin-Ajax**: 
   - REST API (`/wp-json/elementor/v1/*`) for read operations and some write operations
   - Admin-Ajax (`/wp-admin/admin-ajax.php`) for document save operations

6. **Global Classes**: Two contexts exist:
   - `preview` - Changes visible in editor preview
   - `frontend` - Published changes visible on frontend


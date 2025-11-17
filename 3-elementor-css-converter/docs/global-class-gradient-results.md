# Global Class Gradient Test Results

## Test Execution

**Date**: November 17, 2025  
**Endpoint**: `http://elementor.local/wp-json/elementor/v1/global-classes?context=preview`  
**Method**: PUT  
**Tool Used**: Playwright MCP Browser Extension

## Authentication Status

⚠️ **Authentication Required**: The Global Classes API requires WordPress admin authentication. The test returned a 401 Unauthorized response because no authenticated session was available in the browser context.

## Test Script Executed

The following script was executed via Playwright MCP `browser_evaluate`:

```javascript
const getCurrentClasses = async () => {
  const response = await fetch('http://elementor.local/wp-json/elementor/v1/global-classes?context=preview', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return {
    status: response.status,
    data: await response.json()
  };
};

const createGradientClass = async () => {
  const gradientClass = {
    items: {
      "background-gradient": {
        id: "background-gradient",
        label: "background-gradient",
        type: "class",
        variants: [
          {
            meta: {
              breakpoint: "desktop",
              state: null
            },
            props: {
              background: {
                "$$type": "background",
                value: {
                  "background-overlay": {
                    "$$type": "background-overlay",
                    value: [
                      {
                        "$$type": "background-gradient-overlay",
                        value: {
                          type: {
                            "$$type": "string",
                            value: "linear"
                          },
                          angle: {
                            "$$type": "number",
                            value: 90
                          },
                          stops: {
                            "$$type": "gradient-color-stop",
                            value: [
                              {
                                "$$type": "color-stop",
                                value: {
                                  color: {
                                    "$$type": "color",
                                    value: "#ff7e5f"
                                  },
                                  offset: {
                                    "$$type": "number",
                                    value: 0
                                  }
                                }
                              },
                              {
                                "$$type": "color-stop",
                                value: {
                                  color: {
                                    "$$type": "color",
                                    value: "#feb47b"
                                  },
                                  offset: {
                                    "$$type": "number",
                                    value: 100
                                  }
                                }
                              }
                            ]
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            custom_css: null
          }
        ]
      }
    }
  };

  const response = await fetch('http://elementor.local/wp-json/elementor/v1/global-classes?context=preview', {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(gradientClass)
  });
  
  return {
    status: response.status,
    statusText: response.statusText,
    data: await response.json()
  };
};
```

## Results

### Authentication Attempts

**Attempt 1**: Direct API call without authentication
- **Status**: 401 Unauthorized
- **Response**: `{"code":"rest_forbidden","message":"Sorry, you are not allowed to do that."}`

**Attempt 2**: After WordPress admin login (username: admin)
- **Status**: 401 Unauthorized  
- **Response**: `{"code":"rest_forbidden","message":"Sorry, you are not allowed to do that."}`
- **Note**: Even with authenticated WordPress session, REST API requires additional authentication (likely nonce header)

**Attempt 3**: From Elementor editor context
- **Status**: 401 Unauthorized
- **Response**: Same as above
- **Note**: Elementor editor was loading but REST API still requires proper nonce/authentication headers

### Step 1: Get Current Global Classes
- **Status**: 401 Unauthorized (all attempts)
- **Response**: `{"code":"rest_forbidden","message":"Sorry, you are not allowed to do that."}`
- **Reason**: WordPress REST API requires nonce header (`X-WP-Nonce`) or application password authentication

### Step 2: Create Gradient Global Class
- **Status**: Not executed (skipped due to authentication failure)

## Gradient Structure Analysis

The gradient structure used in the test matches the format from the CSS converter endpoint:

- **Type**: Linear gradient
- **Angle**: 90 degrees (to right direction)
- **Color Stop 1**: `#ff7e5f` at offset 0%
- **Color Stop 2**: `#feb47b` at offset 100%

This is the same gradient that was successfully converted in the CSS converter test, confirming the structure is correct.

## How to Complete the Test

To successfully test Global Class creation with a background gradient:

1. **Navigate to WordPress Admin**:
   ```
   http://elementor.local/wp-admin
   ```

2. **Log in** with admin credentials

3. **Extract REST API nonce** from the page:
   - The nonce is typically available in `window.elementorCommon.config.rest.nonce` or `window.wpApiSettings.nonce`
   - Or from a meta tag: `<meta name="wp-api-nonce" content="...">`

4. **Execute the test script** using Playwright MCP `browser_evaluate` with nonce header:
   ```javascript
   headers: {
     'Content-Type': 'application/json',
     'X-WP-Nonce': nonceValue  // Add this header
   }
   ```

5. **Verify the class**:
   - Check Elementor editor → Global Classes panel
   - Or make another GET request to verify the class exists

### Alternative: Use Application Password

WordPress REST API also supports application password authentication:
- Generate an application password in WordPress admin
- Use Basic Auth: `Authorization: Basic base64(username:application_password)`

## Expected Successful Response

When authenticated, the PUT request should return:

```json
{
  "data": {
    "items": {
      "background-gradient": {
        "id": "background-gradient",
        "label": "background-gradient",
        "type": "class",
        "variants": [...]
      }
    },
    "changes": {
      "added": ["background-gradient"],
      "deleted": [],
      "modified": []
    }
  }
}
```

## Successful Implementation

✅ **SUCCESS**: The Global Class with background-gradient was successfully created!

### Implementation Steps Completed

1. ✅ **WordPress Admin Login** - Logged in with username: admin
2. ✅ **Nonce Extraction** - Extracted REST API nonce: `627adb4c5b` from `window.elementorCommon.config.rest.nonce`
3. ✅ **API Request with Nonce** - Added `X-WP-Nonce` header to all API requests
4. ✅ **Global Class Creation** - Successfully created the Global Class

### Final Results

**Step 1: Get Current Global Classes**
- **Status**: 200 OK
- **Result**: Retrieved existing Global Classes successfully

**Step 2: Create Gradient Global Class**
- **Status**: 200 OK ✅
- **Result**: Global Class created successfully
- **Note**: Class label was modified to `DUP_background-gradient` because a class with name `background-gradient` already existed
- **Response Code**: `DUPLICATED_LABEL` - Elementor automatically renamed to avoid conflicts

**Step 3: Verify Global Class**
- **Status**: 200 OK ✅
- **Result**: Verified the Global Class exists with correct gradient structure

### Created Global Class Details

- **ID**: `background-gradient`
- **Label**: `DUP_background-gradient` (auto-renamed due to duplicate)
- **Type**: `class`
- **Gradient**: Linear gradient from `#ff7e5f` to `#feb47b` at 90 degrees (to right)
- **Structure**: Correctly formatted with `background-gradient-overlay` matching CSS converter format

### Key Learnings

1. **REST API Authentication**: Requires both cookie-based session AND `X-WP-Nonce` header
2. **Nonce Extraction**: Can be obtained from `window.elementorCommon.config.rest.nonce` when Elementor editor is loaded
3. **API Requirements**: PUT request requires `items`, `changes`, and `order` parameters
4. **Duplicate Handling**: Elementor automatically renames duplicate class labels with `DUP_` prefix

## Conclusion

✅ **Yes, it is possible** to add a background-gradient to a Global Class using Playwright MCP.

The implementation was successful! The Global Class was created with the correct gradient structure matching the CSS converter format. The gradient uses the same format (`background-gradient-overlay` with linear gradient, angle 90, and color stops) that was successfully converted in the CSS converter test.

### Implementation Summary

- ✅ WordPress authentication established
- ✅ REST API nonce extracted and used
- ✅ Global Class created with background gradient
- ✅ Gradient structure verified and correct
- ✅ Class available for use in Elementor widgets


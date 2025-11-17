# Testing Global Class Creation with Background Gradient

## Objective

Test if we can create a Global Class named "background-gradient" with a linear gradient background using Playwright MCP and the Elementor Global Classes API.

## API Endpoint

- **Get Global Classes**: `GET /wp-json/elementor/v1/global-classes?context=preview`
- **Update Global Classes**: `PUT /wp-json/elementor/v1/global-classes?context=preview`

## Authentication Requirement

⚠️ **Note**: The Global Classes API requires WordPress authentication. You must be logged into WordPress admin before making API calls.

## Gradient Structure

Based on the CSS converter results, a linear gradient background is structured as:

```json
{
  "background": {
    "$$type": "background",
    "value": {
      "background-overlay": {
        "$$type": "background-overlay",
        "value": [
          {
            "$$type": "background-gradient-overlay",
            "value": {
              "type": {
                "$$type": "string",
                "value": "linear"
              },
              "angle": {
                "$$type": "number",
                "value": 90
              },
              "stops": {
                "$$type": "gradient-color-stop",
                "value": [
                  {
                    "$$type": "color-stop",
                    "value": {
                      "color": {
                        "$$type": "color",
                        "value": "#ff7e5f"
                      },
                      "offset": {
                        "$$type": "number",
                        "value": 0
                      }
                    }
                  },
                  {
                    "$$type": "color-stop",
                    "value": {
                      "color": {
                        "$$type": "color",
                        "value": "#feb47b"
                      },
                      "offset": {
                        "$$type": "number",
                        "value": 100
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
}
```

## Global Class Structure

A Global Class with a background gradient should follow this structure:

```json
{
  "items": {
    "background-gradient": {
      "id": "background-gradient",
      "label": "background-gradient",
      "type": "class",
      "variants": [
        {
          "meta": {
            "breakpoint": "desktop",
            "state": null
          },
          "props": {
            "background": {
              "$$type": "background",
              "value": {
                "background-overlay": {
                  "$$type": "background-overlay",
                  "value": [
                    {
                      "$$type": "background-gradient-overlay",
                      "value": {
                        "type": {
                          "$$type": "string",
                          "value": "linear"
                        },
                        "angle": {
                          "$$type": "number",
                          "value": 90
                        },
                        "stops": {
                          "$$type": "gradient-color-stop",
                          "value": [
                            {
                              "$$type": "color-stop",
                              "value": {
                                "color": {
                                  "$$type": "color",
                                  "value": "#ff7e5f"
                                },
                                "offset": {
                                  "$$type": "number",
                                  "value": 0
                                }
                              }
                            },
                            {
                              "$$type": "color-stop",
                              "value": {
                                "color": {
                                  "$$type": "color",
                                  "value": "#feb47b"
                                },
                                "offset": {
                                  "$$type": "number",
                                  "value": 100
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
          "custom_css": null
        }
      ]
    }
  }
}
```

## Playwright MCP Test Script

### Step 1: Get Current Global Classes

```javascript
const getGlobalClasses = async () => {
  const response = await fetch('http://elementor.local/wp-json/elementor/v1/global-classes?context=preview', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  return {
    status: response.status,
    data: data
  };
};
```

### Step 2: Create/Update Global Class with Gradient

```javascript
const createGradientGlobalClass = async () => {
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
  
  const data = await response.json();
  return {
    status: response.status,
    data: data
  };
};
```

## Testing Steps

1. **Navigate to WordPress Admin** (to establish authentication)
2. **Get current Global Classes** to see existing structure
3. **Create the gradient Global Class** using PUT request
4. **Verify the class was created** by getting Global Classes again
5. **Test using the class** in an Elementor page/widget

## Expected Results

- ✅ **200 OK** response from PUT request
- ✅ **Global Class created** with ID "background-gradient"
- ✅ **Gradient properly stored** in the class variants
- ✅ **Class available** for use in Elementor widgets

## Notes

- The `context=preview` parameter makes changes visible in the editor preview
- To publish changes to frontend, use `context=frontend` or update both contexts
- The gradient uses the same structure as widget styles from the CSS converter
- Angle 90 = "to right" direction (0 = to top, 90 = to right, 180 = to bottom, 270 = to left)


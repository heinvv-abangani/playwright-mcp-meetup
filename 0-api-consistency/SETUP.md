# Playwright MCP Demo - Setup Guide

This demo shows how the **Playwright MCP server** can intelligently monitor and analyze API network traffic using AI.

## What is Playwright MCP?

Playwright MCP is an MCP (Model Context Protocol) server that gives AI assistants the ability to:
- Control a browser through Playwright
- Navigate pages and interact with elements
- **Intercept and analyze network requests**
- Take screenshots and recordings
- Provide intelligent insights about web application behavior

## Quick Setup

### 1. Install Dependencies

```bash
cd /home/claude/playwright-mcp-demo

# Install API server dependencies
npm install express cors

# Install Playwright MCP server
npx @modelcontextprotocol/create-server playwright-mcp
```

### 2. Start the Demo API

```bash
# Terminal 1
node server.js
```

You should see:
```
🚀 Demo API Server running on http://localhost:3000
```

### 3. Configure Playwright MCP in Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on Mac):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp"
      ]
    }
  }
}
```

Restart Claude Desktop.

### 4. Alternative: Use with MCP Inspector

For debugging and demonstration:

```bash
npx @modelcontextprotocol/inspector npx @playwright/mcp
```

## Demo Scenarios for Your Presentation

### Scenario 1: Detect Slow Endpoints

**Your prompt to Claude:**
```
Navigate to http://localhost:3000 and click all the API request buttons. 
Monitor the network requests and tell me:
1. Which endpoints are slow (>1000ms)?
2. What are their cache headers?
3. What recommendations would you make?
```

**What Claude/MCP will do:**
- Launch Playwright browser
- Navigate to the page
- Intercept ALL network requests
- Click each button
- Analyze response times
- Check cache-control headers
- Provide intelligent recommendations

**Expected insights:**
- Analytics endpoint takes ~2500ms
- Has `Cache-Control: no-store` (bad!)
- Recommendation: Add caching or optimize backend

### Scenario 2: Detect API Breaking Changes

**Your prompt:**
```
Go to http://localhost:3000. 
Click "Load Users V1" and save the response schema.
Then click "Load Users V2" and compare the schemas.
What breaking changes do you detect?
```

**What Claude/MCP will analyze:**
- V1 schema: `{id, name, email, role}`
- V2 schema: `{userId, fullName, contact, userRole}`
- ALL field names changed!
- Different response structure (`users` array vs `data` array)

**Demonstration value:**
Shows how MCP can automatically detect API contract violations that would break client applications.

### Scenario 3: Reliability Testing

**Your prompt:**
```
Navigate to http://localhost:3000. 
Click the "Load Orders" button 10 times rapidly.
Track how many requests fail and analyze the error patterns.
What's the failure rate and what should be done about it?
```

**What Claude/MCP will show:**
- ~30% failure rate (by design)
- 500 errors with "Database connection timeout"
- Pattern: Random failures, not sequential
- Recommendation: Implement retry logic, circuit breaker

### Scenario 4: Comprehensive API Audit

**Your prompt:**
```
Please audit all the APIs on http://localhost:3000. 
For each endpoint, check:
- Response time
- Cache headers
- Success/error rates
- Response schema
Then provide a prioritized list of issues and recommendations.
```

**What this demonstrates:**
- Full network interception capabilities
- Intelligent pattern recognition
- Priority-based recommendations
- Natural language reporting

### Scenario 5: Monitor Endpoint That Doesn't Exist

**Your prompt:**
```
Navigate to http://localhost:3000 and try to load the "Legacy" endpoint.
What happens and what does this indicate?
```

**What Claude/MCP will detect:**
- 404 Not Found error
- Endpoint: `/api/v1/legacy-endpoint`
- Analysis: Possible breaking change - endpoint was removed
- Recommendation: Check API documentation, update integrations

## Technical Details: How It Works

### Network Interception

When you use Playwright MCP, it automatically intercepts network requests:

```javascript
// This happens behind the scenes in Playwright MCP
page.on('response', async (response) => {
  const request = response.request();
  const timing = response.timing();
  
  // MCP captures:
  - URL and method
  - Status code
  - Response headers (especially Cache-Control)
  - Timing information
  - Response body (when needed)
});
```

### The MCP Intelligence Layer

The AI (Claude) analyzes this data to:

1. **Pattern Recognition**
   - Slow endpoints
   - High failure rates
   - Missing caching
   - Schema inconsistencies

2. **Context Understanding**
   - Knows what "good" caching looks like
   - Understands API versioning patterns
   - Recognizes common error patterns

3. **Actionable Recommendations**
   - Prioritizes issues by severity
   - Suggests specific fixes
   - Explains business impact

## Presentation Flow

### Part 1: The Problem (3 min)
"Modern web apps make dozens of API calls. Breaking changes slip through. Performance degrades. Manual testing is tedious."

[Show the demo page with 6 different API buttons]

### Part 2: Traditional Approach (2 min)
"You could manually click each button, check DevTools, write down response times... or..."

### Part 3: Playwright MCP Demo (10 min)

**Live demonstration:**

1. **Show Claude with MCP enabled**
   - Highlight the Playwright MCP server in status

2. **Give Claude the first prompt** (Scenario 1: Slow Endpoints)
   - Watch as Claude controls the browser
   - See network requests being intercepted
   - Get intelligent analysis

3. **Show the analysis**
   - Claude identifies the slow analytics endpoint
   - Points out missing cache headers
   - Provides specific recommendations

4. **Second prompt** (Scenario 2: Breaking Changes)
   - Watch Claude compare API versions
   - See it detect all field name changes
   - Get breaking change report

5. **Ask Claude to generate a report**
   ```
   Create a comprehensive API health report in markdown format
   ```
   - Watch Claude synthesize all findings
   - See prioritized recommendations
   - Get actionable next steps

### Part 4: The Value (3 min)

**Key points:**
- ✅ Automated API monitoring
- ✅ Intelligent analysis (not just data collection)
- ✅ Natural language interaction
- ✅ Catches issues before production
- ✅ Works with ANY web application

**Use cases:**
- CI/CD pipeline integration
- Pre-deployment checks
- Third-party API monitoring
- Performance regression detection
- API contract testing

## Advanced Demo Ideas

### Integration with CI/CD

Show how you could script this:

```bash
# In your CI pipeline
claude-cli "Audit all APIs on staging.example.com and fail if 
any critical issues are found"
```

### Historical Comparison

```
Compare the current API performance against the baseline from last week.
Which endpoints have regressed?
```

### Multi-page Workflows

```
Navigate through a complete user checkout flow and monitor all 
API calls. Which APIs are called multiple times unnecessarily?
```

## Troubleshooting

### Playwright MCP not showing in Claude

1. Check config file location
2. Restart Claude Desktop completely
3. Check terminal for MCP server errors

### Network requests not being captured

1. Ensure page fully loads before clicking
2. Add delays if needed: "Wait 2 seconds then click..."
3. Check CORS settings on API

### Performance issues

- MCP adds minimal overhead (<50ms)
- If slow, check browser resources
- Consider headless mode for CI

## Resources

- Playwright MCP: https://github.com/microsoft/playwright-mcp
- MCP Protocol: https://modelcontextprotocol.io
- Playwright Docs: https://playwright.dev

## Questions for Your Audience

1. "Who has experienced an API breaking change in production?"
2. "How do you currently test API performance?"
3. "What would you want an AI to check about your APIs?"

## Demo Checklist

Before your presentation:
- [ ] API server running on localhost:3000
- [ ] Playwright MCP configured in Claude Desktop
- [ ] Demo page loads (http://localhost:3000)
- [ ] Test one prompt end-to-end
- [ ] Increase terminal font size
- [ ] Clear browser cache/history
- [ ] Have backup screenshots
- [ ] Practice your narration

During presentation:
- [ ] Start API server first
- [ ] Show the config file briefly
- [ ] Keep prompts simple and clear
- [ ] Pause to let audience absorb insights
- [ ] Point out key findings explicitly
- [ ] End with "what would you test?"

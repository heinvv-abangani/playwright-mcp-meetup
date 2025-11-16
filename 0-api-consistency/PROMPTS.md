# Playwright MCP Demo - Prompt Cheat Sheet

Quick reference for demo prompts to use during your presentation.

---

## 🚀 Getting Started Prompt

```
Navigate to http://localhost:3000
```

*Use this to verify everything is working before starting the real demos.*

---

## 📊 Demo Scenario 1: Performance Analysis

**Prompt:**
```
Navigate to http://localhost:3000 and click all the API request buttons. 
Monitor the network requests and identify:
1. Which endpoints are slow (>1000ms)?
2. What are their cache headers?
3. What recommendations would you make?
```

**Expected findings:**
- Analytics endpoint: ~2500ms
- Cache-Control: no-store
- Recommendation: Add caching

**Key talking point:** "Notice how Claude doesn't just report data - it understands what 'slow' means and provides specific fixes."

---

## 🔄 Demo Scenario 2: Breaking Changes

**Prompt:**
```
Go to http://localhost:3000.
Click "Load Users V1" and save the response schema.
Then click "Load Users V2" and compare the schemas.
What breaking changes do you detect?
```

**Expected findings:**
- Response structure changed: `users` → `data`
- All field names changed (id→userId, name→fullName, etc.)
- Breaking changes that would crash clients

**Key talking point:** "This is exactly what breaks mobile apps in production. Claude caught every field change automatically."

---

## ❌ Demo Scenario 3: Reliability Testing

**Prompt:**
```
Navigate to http://localhost:3000.
Click the "Load Orders" button 10 times.
Track how many requests fail and analyze the error patterns.
What's the failure rate and what should be done about it?
```

**Expected findings:**
- ~30% failure rate
- Random 500 errors
- "Database connection timeout"
- Recommendation: Retry logic + circuit breaker

**Key talking point:** "30% failure rate would destroy user experience. Claude detected it and suggested specific patterns to fix it."

---

## 🔍 Demo Scenario 4: Missing Endpoints

**Prompt:**
```
Navigate to http://localhost:3000 and try to load the "Legacy" endpoint.
What happens and what does this indicate?
```

**Expected findings:**
- 404 Not Found
- Endpoint: /api/v1/legacy-endpoint
- Possible breaking change - endpoint was removed

**Key talking point:** "This catches breaking changes where endpoints are removed without notice."

---

## 📋 Demo Scenario 5: Comprehensive Audit

**Prompt:**
```
Please audit all the APIs on http://localhost:3000. 
For each endpoint, check:
- Response time
- Cache headers
- Success/error rates
- Response schema

Then provide a prioritized list of issues and recommendations.
```

**Expected findings:**
- Complete analysis of all endpoints
- Issues ranked by severity
- Specific recommendations for each
- Business impact explained

**Key talking point:** "In 30 seconds, we get a complete API audit that would take hours manually."

---

## 🎯 Advanced Prompts

### Cost Analysis
```
Analyze the caching strategies across all endpoints.
Calculate how much bandwidth is wasted by poor caching if we serve 1 million requests per day.
```

### Comparative Analysis
```
Compare the V1 and V2 users endpoints.
Generate a migration guide explaining what needs to change in client code.
```

### Documentation Validation
```
Based on the actual API responses you observed, generate OpenAPI/Swagger documentation for these endpoints.
```

### Security Check
```
Check if any endpoints are missing security headers like:
- CORS headers
- Content-Security-Policy
- X-Content-Type-Options
```

### User Flow Analysis
```
Navigate to http://localhost:3000 and simulate a typical user session by clicking the buttons in this order:
1. Load Users
2. Load Products  
3. Load Analytics

Which APIs are called? Are there any unnecessary duplicate requests?
```

---

## 💬 Interactive Prompts (for Q&A)

### "Can it handle authentication?"

**Demo prompt:**
```
Navigate to https://example.com/login
Fill in username "demo" and password "demo123"
After logging in, check if authentication tokens are properly set in subsequent API calls.
```

### "What about GraphQL?"

**Demo prompt:**
```
Navigate to https://your-graphql-endpoint.com
Intercept the GraphQL query for user data.
Analyze the query complexity and response time.
```

### "Can it test error handling?"

**Demo prompt:**
```
Navigate to http://localhost:3000
Try to load each endpoint, but simulate network delays.
Which endpoints handle timeouts gracefully?
```

---

## 🎤 Backup Prompts (if something fails)

### If browser doesn't start:
```
Use a visible browser window so we can see what's happening
```

### If network interception misses requests:
```
Wait 3 seconds after clicking each button to ensure all requests complete
```

### If analysis is too brief:
```
Provide more detailed analysis including specific header values and exact timing measurements
```

### If you want to show code:
```
Show me an example of how you're intercepting these network requests in Playwright
```

---

## 📊 Presentation Flow Template

```
1. Opening (3 min)
   └─ Tell the "broken API" story
   
2. Theory (2 min)
   └─ Explain Playwright + MCP briefly
   
3. Demo #1 - Performance (3 min)
   └─ Use: "Monitor network and identify slow endpoints"
   
4. Demo #2 - Breaking Changes (3 min)
   └─ Use: "Compare V1 and V2 users endpoints"
   
5. Demo #3 - Reliability (2 min)
   └─ Use: "Click Orders 10 times, track failures"
   
6. The Intelligence Layer (2 min)
   └─ Use: "Comprehensive audit" to show full analysis
   
7. Use Cases (2 min)
   └─ CI/CD, monitoring, documentation
   
8. Q&A (3 min)
   └─ Use backup prompts based on questions
```

---

## 🔧 Troubleshooting Prompts

### If MCP isn't responding:
```
Can you see the Playwright MCP server in your available tools?
```

### If you want to restart:
```
Close the browser and start fresh
```

### If you need to be more specific:
```
Use Chrome browser in headed mode.
Navigate to http://localhost:3000.
Wait for the page to fully load.
Then click the "Load Users V1" button.
Intercept the network request and show me the full response including headers.
```

---

## 💡 Tips for Live Demos

### Before you start:
- Test all prompts beforehand
- Keep this cheat sheet visible on second monitor
- Have the API server pre-running

### During demo:
- Copy-paste prompts (don't type live)
- Pause after each insight to let audience absorb
- Point at specific parts of Claude's response
- Read key findings aloud

### If something goes wrong:
- Use backup screenshots
- Explain what should happen
- Show recorded video if needed
- Remember: Failures are learning moments!

---

## 🎯 Key Messages to Reinforce

After each demo, emphasize:

✅ **Not just data collection** - "Notice Claude didn't just log the data, it understood it"

✅ **Context understanding** - "It knows what 'slow' means, what 'good caching' looks like"

✅ **Actionable insights** - "Not just 'here's a problem' but 'here's HOW to fix it'"

✅ **Natural language** - "No code needed, just ask what you want to know"

✅ **Real browser, real timing** - "This is actual user experience, not mocked data"

---

## 📱 One-Liner Prompts (for quick demos)

```
Audit http://localhost:3000 APIs
```

```
Find slow endpoints on http://localhost:3000
```

```
Compare V1 and V2 users endpoints
```

```
Test reliability of the orders endpoint
```

```
Generate an API monitoring report for http://localhost:3000
```

---

## 🎬 Closing Prompt (end of presentation)

```
Based on what we've tested, generate a summary report including:
1. Critical issues that need immediate attention
2. Performance optimization opportunities
3. Estimated time savings from fixing these issues
4. Next steps for implementation

Format it as a Slack message I could send to my team.
```

**This shows:**
- Complete synthesis of all findings
- Business value translation
- Practical next steps
- Real-world application

---

**Remember:** The goal is to show how AI + Playwright MCP makes API monitoring intelligent, automated, and actionable!

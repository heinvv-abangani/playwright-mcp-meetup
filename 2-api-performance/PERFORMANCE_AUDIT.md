# Performance Audit Report - localhost:8080

**Date:** Generated via Playwright MCP  
**URL:** http://localhost:8080  
**Page Load Time:** 201.4ms  
**DOM Content Loaded:** 24.5ms

## Executive Summary

The site makes **15 total network requests** including multiple third-party tracking scripts, API calls, and analytics beacons. Several performance issues were identified:

- ❌ Failed API requests (2 endpoints)
- ⚠️ Multiple duplicate Google Tag Manager requests (8+ requests)
- ⚠️ Third-party tracking scripts blocking page load
- ⚠️ Unnecessary API calls on page load

## API Endpoints Analysis

### Local APIs (localhost:8080)

| Endpoint | Method | Status | Duration | Notes |
|----------|--------|--------|----------|-------|
| `/` | GET | 200 | 201.4ms | Main page load |

### External APIs

#### Failed Requests
| Endpoint | Method | Status | Duration | Issue |
|----------|--------|--------|----------|-------|
| `http://api.example.com/data` | GET | ERR_NAME_NOT_RESOLVED | 112.3ms | Domain doesn't resolve |
| `http://tracking.example.com/collect` | POST | ERR_NAME_NOT_RESOLVED | 280.6ms | Domain doesn't resolve |

#### Successful External APIs
| Endpoint | Method | Status | Duration | Type | Notes |
|----------|--------|--------|----------|------|-------|
| `https://jsonplaceholder.typicode.com/posts/1` | GET | 200 | 70.4ms | fetch | Unnecessary call on page load |

### Third-Party Tracking & Analytics

#### Google Tag Manager
**Issue:** Excessive duplicate requests (8+ requests with same parameters)

| Request Type | Count | Avg Duration | Total Impact |
|--------------|-------|--------------|--------------|
| GTM init/js/dom/load events | 4 | ~14ms | 56ms |
| GTM custom events (*) | 4+ | ~15ms | 60ms+ |

**Performance Impact:** ~116ms+ wasted on duplicate GTM beacons

#### Facebook Pixel
| Endpoint | Method | Status | Duration | Type |
|----------|--------|--------|----------|------|
| `fbevents.js` | GET | 200 | 0ms | script |
| `signals/config/...` | GET | 200 | 0ms | script |
| `tr/?id=...&ev=PageView` | GET | 200 | 42.5ms | img |
| `privacy_sandbox/pixel/register/trigger` | GET | 200 | 139.5ms | img |

**Performance Impact:** ~182ms for Facebook tracking

## Performance Issues Identified

### 1. Failed API Requests ⚠️
- **`http://api.example.com/data`** - 112.3ms wasted on failed request
- **`http://tracking.example.com/collect`** - 280.6ms wasted on failed POST request
- **Impact:** ~393ms wasted on non-functional endpoints

### 2. Duplicate Google Tag Manager Requests ⚠️
- Multiple GTM beacons with identical parameters
- 8+ separate requests for tracking events
- **Recommendation:** Consolidate GTM events or use batching

### 3. Third-Party Script Blocking ⚠️
- Google Tag Manager script (77ms)
- Facebook Pixel scripts (loaded but 0ms duration - cached)
- **Impact:** Blocks initial page render

### 4. Unnecessary API Calls on Page Load ⚠️
- `jsonplaceholder.typicode.com/posts/1` called automatically on load
- No user interaction required
- **Recommendation:** Lazy load or trigger on user action

### 5. Insecure HTTP Endpoints 🔒
- `http://api.example.com/data` (failed)
- `http://tracking.example.com/collect` (failed)
- **Security Risk:** Even if working, HTTP endpoints expose data

## Performance Metrics

### Page Load Performance
- **Page Load Time:** 201.4ms ✅ (Good)
- **DOM Content Loaded:** 24.5ms ✅ (Excellent)
- **Total Resources:** 15
- **Total Transfer Size:** 0 bytes (likely cached or failed requests)

### Slowest Resources (Top 5)
1. `tracking.example.com/collect` - 280.6ms (FAILED)
2. Facebook Privacy Sandbox Pixel - 139.5ms
3. `api.example.com/data` - 112.3ms (FAILED)
4. Google Tag Manager JS - 77ms
5. `jsonplaceholder.typicode.com/posts/1` - 70.4ms

## Recommendations

### High Priority
1. **Fix or Remove Failed Endpoints**
   - Remove `api.example.com` and `tracking.example.com` calls
   - Or implement proper error handling to prevent wasted requests

2. **Consolidate GTM Requests**
   - Batch multiple GTM events into single requests
   - Reduce from 8+ requests to 1-2 requests

3. **Remove Unnecessary Page Load API Calls**
   - Move `jsonplaceholder.typicode.com/posts/1` to user-triggered action
   - Or implement lazy loading

### Medium Priority
4. **Optimize Third-Party Scripts**
   - Load tracking scripts asynchronously
   - Consider deferring non-critical analytics

5. **Implement Request Caching**
   - Cache API responses where appropriate
   - Reduce duplicate external API calls

### Security
6. **Migrate HTTP to HTTPS**
   - All API endpoints should use HTTPS
   - Prevents man-in-the-middle attacks

## API Endpoints Summary

### All APIs Accessed:
1. `http://localhost:8080/` ✅
2. `http://api.example.com/data` ❌ (Failed)
3. `http://tracking.example.com/collect` ❌ (Failed)
4. `https://jsonplaceholder.typicode.com/posts/1` ✅
5. `https://www.googletagmanager.com/*` ✅ (8+ requests)
6. `https://connect.facebook.net/*` ✅ (4 requests)

**Total Unique Domains:** 5  
**Total Requests:** 15  
**Failed Requests:** 2 (13.3% failure rate)

---

*Generated using Playwright MCP Browser Extension*


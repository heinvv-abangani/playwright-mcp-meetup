# Swagger Petstore API Testing

This folder contains Playwright tests and documentation for testing the Swagger Petstore API, focusing on API security and authentication analysis.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
npm install
```

### Run Tests

```bash
npx playwright test
```

### View Test Report

```bash
npx playwright show-report
```

---

## 📚 API Documentation

**Swagger UI:** https://petstore.swagger.io/  
**Base URL:** `https://petstore.swagger.io/v2`  
**API Spec:** https://petstore.swagger.io/v2/swagger.json

---

## 🔐 Authentication

### Available Authentication Methods

1. **API Key (api_key)**
   - **Type:** Header-based
   - **Header:** `api_key: special-key`
   - **Usage:** Some endpoints use this for authorization filters

2. **OAuth2 (petstore_auth)**
   - **Type:** OAuth2 Implicit Flow
   - **Authorization URL:** `https://petstore.swagger.io/oauth/authorize`
   - **Scopes:** `read:pets`, `write:pets`

### Authentication Status

**User Management Endpoints:** ❌ **Authentication NOT Required**

Despite documentation stating "This can only be done by the logged in user," user creation and retrieval endpoints work without authentication.

---

## 📋 API Endpoints

### User Management

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/user` | POST | ❌ | Create a new user |
| `/user/{username}` | GET | ❌ | Get user by username |
| `/user/{username}` | PUT | ❌* | Update user |
| `/user/{username}` | DELETE | ❌* | Delete user |
| `/user/login` | GET | ❌ | Login user |
| `/user/logout` | GET | ❌ | Logout user |
| `/user/createWithArray` | POST | ❌ | Create multiple users (array) |
| `/user/createWithList` | POST | ❌ | Create multiple users (list) |

*Documentation suggests auth required, but not enforced

### User Model

```json
{
  "id": 0,
  "username": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "userStatus": 0
}
```

---

## 🧪 Default Test Prompts

### Create User Test

**Prompt:**
```
Test the Swagger Petstore API:
1. Create a new user with:
   - username: "hein123456"
   - firstName: "hein"
   - lastName: "vv"
   - email: "hein123456@email.ext"
   - password: [auto-generate]
   - phone: "123456890"
2. Retrieve the user by username
3. Verify all user data matches
```

### Authentication Test

**Prompt:**
```
Test Swagger Petstore API authentication:
1. Test user creation without authentication
2. Test user creation with api_key authentication
3. Test user retrieval without authentication
4. Document which endpoints require authentication
```

### Security Audit

**Prompt:**
```
Audit Swagger Petstore API security:
1. Check if authentication is enforced
2. Test password handling in responses
3. Verify user data exposure
4. Document security findings
```

---

## 📊 Test Results

See [docs/api-testing.md](./docs/api-testing.md) for detailed test results and security findings.

### Summary

- ✅ User creation works without authentication
- ✅ User retrieval works without authentication
- ⚠️ Passwords returned in API responses
- ⚠️ No authentication enforcement for user endpoints

---

## 🔍 Security Findings

1. **No Authentication Required** (Medium Risk)
   - User endpoints accessible without authentication
   - Potential for unauthorized access

2. **Password Exposure** (High Risk)
   - Passwords returned in GET responses
   - Violates security best practices

See [docs/api-testing.md](./docs/api-testing.md) for complete security analysis.

---

## 📁 Project Structure

```
1-swagger-api-testing/
├── tests/
│   └── petstore-api.spec.ts    # Playwright test file
├── docs/
│   └── api-testing.md          # Detailed test results
├── playwright.config.ts         # Playwright configuration
└── README.md                    # This file
```

---

## 🛠️ Development

### Writing New Tests

Create test files in the `tests/` directory following the pattern:

```typescript
import { test, expect } from '@playwright/test';

test('test description', async ({ request }) => {
  const response = await request.get('https://petstore.swagger.io/v2/user/username');
  expect(response.status()).toBe(200);
});
```

### Test Configuration

Tests use the Playwright configuration in `playwright.config.ts`. Modify as needed for your testing requirements.

---

## 📝 Notes

- The Swagger Petstore API is a sample/test API
- Some endpoints may have inconsistent behavior
- User data may be reset periodically
- This is for testing/learning purposes only

---

## 🔗 Related Resources

- [Swagger Petstore Documentation](https://petstore.swagger.io/)
- [Playwright Documentation](https://playwright.dev/)
- [API Testing Best Practices](https://petstore.swagger.io/)

---

**Last Updated:** January 2025


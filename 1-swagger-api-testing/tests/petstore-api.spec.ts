import { test, expect } from '@playwright/test';

const API_BASE_URL = 'https://petstore.swagger.io/v2';
const TEST_USERNAME = 'hein123456';

function generateRandomPassword(): string {
  const randomPart = Math.random().toString(36).slice(-12);
  return `${randomPart}A1!`;
}

test.describe('Swagger Petstore API - User Management', () => {
  let generatedPassword: string;
  let createdUserId: number;

  test.beforeEach(() => {
    generatedPassword = generateRandomPassword();
  });

  test('should create a new user without authentication', async ({ request }) => {
    const userData = {
      id: 0,
      username: TEST_USERNAME,
      firstName: 'hein',
      lastName: 'vv',
      email: 'hein123456@email.ext',
      password: generatedPassword,
      phone: '123456890',
      userStatus: 0
    };

    const response = await request.post(`${API_BASE_URL}/user`, {
      data: userData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('code', 200);
    expect(responseBody).toHaveProperty('type', 'unknown');
    expect(responseBody).toHaveProperty('message');
    
    createdUserId = parseInt(responseBody.message);
    expect(createdUserId).toBeGreaterThan(0);
  });

  test('should create a new user with api_key authentication', async ({ request }) => {
    const userData = {
      id: 0,
      username: `${TEST_USERNAME}_auth`,
      firstName: 'hein',
      lastName: 'vv',
      email: 'hein123456_auth@email.ext',
      password: generatedPassword,
      phone: '123456890',
      userStatus: 0
    };

    const response = await request.post(`${API_BASE_URL}/user`, {
      data: userData,
      headers: {
        'Content-Type': 'application/json',
        'api_key': 'special-key'
      }
    });

    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('code', 200);
    expect(responseBody).toHaveProperty('type', 'unknown');
    expect(responseBody).toHaveProperty('message');
  });

  test('should retrieve user by username without authentication', async ({ request }) => {
    const createUserData = {
      id: 0,
      username: TEST_USERNAME,
      firstName: 'hein',
      lastName: 'vv',
      email: 'hein123456@email.ext',
      password: generatedPassword,
      phone: '123456890',
      userStatus: 0
    };

    await request.post(`${API_BASE_URL}/user`, {
      data: createUserData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    const getUserResponse = await request.get(`${API_BASE_URL}/user/${TEST_USERNAME}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(getUserResponse.status()).toBe(200);
    
    const user = await getUserResponse.json();
    expect(user).toHaveProperty('username', TEST_USERNAME);
    expect(user).toHaveProperty('firstName', 'hein');
    expect(user).toHaveProperty('lastName', 'vv');
    expect(user).toHaveProperty('email', 'hein123456@email.ext');
    expect(user).toHaveProperty('phone', '123456890');
    // expect(user).toHaveProperty('password', generatedPassword);
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('userStatus', 0);
  });

  test('should verify created user exists in the system', async ({ request }) => {
    const userData = {
      id: 0,
      username: TEST_USERNAME,
      firstName: 'hein',
      lastName: 'vv',
      email: 'hein123456@email.ext',
      password: generatedPassword,
      phone: '123456890',
      userStatus: 0
    };

    const createResponse = await request.post(`${API_BASE_URL}/user`, {
      data: userData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(createResponse.status()).toBe(200);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const getUserResponse = await request.get(`${API_BASE_URL}/user/${TEST_USERNAME}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(getUserResponse.status()).toBe(200);
    
    const retrievedUser = await getUserResponse.json();
    
    expect(retrievedUser.username).toBe(userData.username);
    expect(retrievedUser.firstName).toBe(userData.firstName);
    expect(retrievedUser.lastName).toBe(userData.lastName);
    expect(retrievedUser.email).toBe(userData.email);
    expect(retrievedUser.phone).toBe(userData.phone);
    // expect(retrievedUser.password).toBe(userData.password);
  });

  test('should return 404 for non-existent user', async ({ request }) => {
    const nonExistentUsername = `nonexistent_${Date.now()}`;
    
    const response = await request.get(`${API_BASE_URL}/user/${nonExistentUsername}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(404);
  });
});


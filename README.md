# Authentication with Protected Routes in Next.js using Context API and Laravel API (Sanctum)

This documentation outlines the steps to implement authentication and protected routes in a **Next.js** application using the **Context API** for state management and integrating with a **Laravel API** that uses **Sanctum** for cookie-based authentication.

## Table of Contents

1. [Overview](#overview)
2. [Project Setup](#project-setup)
3. [Authentication Flow](#authentication-flow)
4. [Protected Routes](#protected-routes)
5. [Logout](#logout)
6. [Error Handling](#error-handling)

## Overview

This project demonstrates how to authenticate users and manage protected routes in a Next.js application using the **Context API** for global state management. The authentication process is handled through a **Laravel API** that uses **Sanctum** for authentication via cookies.

**Key Features**:
- User login and logout using Laravel Sanctum
- Context API for global authentication state management
- Protected routes that require user authentication

## Project Setup

### 1. Install Dependencies

To begin, clone the repository and install the required dependencies:

```bash
git clone https://github.com/your-repository/nextjs-laravel-auth
cd nextjs-laravel-auth
npm install
```

### 2. Environment Configuration

- Set the API URL in your `.env.local` file for the Next.js app:

```bash
NEXT_PUBLIC_API_URL=https://mges.tech/api
```

### 3. Start Development Server

Run the Next.js development server:

```bash
npm run dev
```

Ensure your Laravel backend is running and correctly set up to support **Sanctum** authentication.

## Authentication Flow

### 1. Login API

The login API allows users to authenticate using their email and password. Upon a successful login, a **Sanctum cookie** will be set, which will be used to authenticate future requests.

#### Login Request

- **Endpoint**: `POST https://mges.tech/api/resources`
- **Headers**:
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Request Body**:
    ```json
    {
      "resource": "auth",
      "action": "login",
      "email": "f1@gmail.com",
      "password": "12345678"
    }
    ```

Upon successful login, a cookie is set in the browser, which can be used to authenticate subsequent requests to the Laravel backend.

### 2. Context API for Authentication State

The authentication state is managed globally using the **Context API** in Next.js. The `AuthContext` provides a state for the current user and allows the `login` and `logout` actions to be executed.

- **login()**: Authenticates the user and stores their information in the context.
- **logout()**: Logs out the user and removes their information from the context.

This context can be accessed from any component in the application to get the current authentication state and manage protected routes.

## Protected Routes

A **protected route** is a route that can only be accessed by authenticated users. If the user is not authenticated, they will be redirected to the login page.

To implement protected routes in Next.js:
- Create a higher-order component (HOC) that checks the authentication state.
- If the user is authenticated, allow them to access the route; otherwise, redirect them to the login page.

### Example Protected Route:

```javascript
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); // Redirect to login page if not authenticated
    }
  }, [isAuthenticated]);

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
```

## Logout

To log the user out, send a **logout** request to the Laravel API, which will invalidate the Sanctum cookie on the server.

### 1. Logout API

- **Endpoint**: `POST https://mges.tech/api/resources`
- **Headers**:
  - `Content-Type: application/json`
  - `Accept: application/json`
  - `Authorization: Bearer {token}`

#### Request Body:
```json
{
  "resource": "auth",
  "action": "logout"
}
```

Upon success, the user will be logged out and redirected to the login page.

### 2. Logout in Context

After calling the logout API, clear the user data in the **AuthContext** and delete the authentication cookie from the browser.

### Example:

```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const logout = async () => {
  // Call the logout API
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resources`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${authToken}`, // Pass the token
    },
    body: JSON.stringify({
      resource: 'auth',
      action: 'logout',
    }),
  });

  // Clear the user session in context
  setUser(null); // Clear user data
  setIsAuthenticated(false); // Update the authentication state
};
```

## Error Handling

Handle common errors such as invalid credentials or API failures gracefully:

- **Invalid Credentials**: Display an error message if the login fails due to incorrect credentials.
- **API Errors**: Show a generic error message if the API request fails (e.g., server errors).

### Example Error Handling for Login:

```javascript
const login = async (email, password) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        resource: 'auth',
        action: 'login',
        email,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    // Store authentication token and user info
  } catch (error) {
    console.error('Login failed:', error.message);
    alert('Login failed. Please check your credentials and try again.');
  }
};
```


/**
 * An array of routes that are accessible to the public without authentication.
 * These routes do not require any authentication checks.
 * @type {string[]}
 */
export const publicRoutes = [
    '/',
    '/about-us',
    '/services',
    '/contact-us',
    '/log-in',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/terms-of-service',
    '/privacy-policy',
];


/**
 * An array of routes that are used for  authentication.
 * THese routes will redirect logged in Users to the dashboard page 
 * @type {string[]}
 */
export const authRoutes = [
    "/log-in", "/register",
]

/**
 * The prefix for api authentication routes.
 * Routes that start with this prefix are used for authentication-related API calls. 
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after a successful login.
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/admin";
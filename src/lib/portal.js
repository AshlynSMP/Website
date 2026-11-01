import { config } from '../config.js';
import { navigate } from './router.js';

const TOKEN_KEY = 'ashlyn-portal';
const LOGIN_KEY = 'ashlyn-portal-login';
const SCOPES = 'openid profile';

export class PortalError extends Error {}

const redirectUri = () => `${location.origin}/portal`;

function read(storage, key) {
    try {
        return JSON.parse(storage.getItem(key));
    } catch {
        return null;
    }
}

function write(storage, key, value) {
    try {
        if (value === null) storage.removeItem(key);
        else storage.setItem(key, JSON.stringify(value));
    } catch {}
}

function randomString(bytes) {
    return base64Url(crypto.getRandomValues(new Uint8Array(bytes)));
}

function base64Url(bytes) {
    return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function getToken() {
    const saved = read(localStorage, TOKEN_KEY);
    return saved && saved.expires > Date.now() + 30000 ? saved.token : null;
}

export function signOut() {
    write(localStorage, TOKEN_KEY, null);
}

export async function signIn() {
    const verifier = randomString(48);
    const state = randomString(16);
    const challenge = base64Url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
    write(sessionStorage, LOGIN_KEY, { verifier, state, back: location.pathname });

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: config.watchdog.clientId,
        redirect_uri: redirectUri(),
        scope: SCOPES,
        state,
        code_challenge: challenge,
        code_challenge_method: 'S256'
    });
    location.assign(`${config.watchdog.url}/connect/authorize?${params}`);
}

let callback = null;

function isLoginCallback() {
    const params = new URLSearchParams(location.search);
    return params.has('state') && (params.has('code') || params.has('error'));
}

export function handleLoginCallback() {
    if (!callback && isLoginCallback()) callback = finishSignIn();
    return callback;
}

async function finishSignIn() {
    const params = new URLSearchParams(location.search);
    const login = read(sessionStorage, LOGIN_KEY);
    write(sessionStorage, LOGIN_KEY, null);
    navigate(login?.back?.startsWith('/portal') ? login.back : '/portal', { replace: true });

    if (params.get('error')) throw new PortalError(params.get('error') === 'access_denied' ? 'denied' : 'login-failed');
    if (!login || login.state !== params.get('state')) throw new PortalError('login-failed');

    const body = await request('/portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: params.get('code'), verifier: login.verifier, redirectUri: redirectUri() })
    });
    write(localStorage, TOKEN_KEY, { token: body.token, expires: Date.now() + body.expiresIn * 1000 });
}

async function request(path, options = {}) {
    let res;
    try {
        res = await fetch(`${config.apiUrl}${path}`, { cache: 'no-store', ...options });
    } catch {
        throw new PortalError('offline');
    }
    const body = await res.json().catch(() => ({}));
    if (res.status === 401 && body.error !== 'login-failed') {
        signOut();
        throw new PortalError('unauthorized');
    }
    if (!res.ok) throw Object.assign(new PortalError(body.error ?? 'offline'), { reason: body.reason ?? null });
    return body;
}

function authed(path, method = 'GET', body) {
    const token = getToken();
    if (!token) return Promise.reject(new PortalError('unauthorized'));
    const headers = { Authorization: `Bearer ${token}` };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    return request(path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
}

export const fetchMe = () => authed('/portal/me');
export const createCode = () => authed('/portal/link', 'POST');
export const unlink = () => authed('/portal/link', 'DELETE');
export const fetchEvents = () => authed('/portal/events');
export const answerEvent = (time, going) => authed('/portal/rsvp', 'POST', { time, going });
export const fetchAdmin = () => authed('/portal/admin');
export const handleRequest = (name, action) => authed('/portal/admin/requests', 'POST', { name, action });
export const planEvent = (name, time) => authed('/portal/admin/events', 'POST', { name, time });
export const changeSettings = (settings) => authed('/portal/admin/settings', 'POST', settings);

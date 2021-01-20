import 'regenerator-runtime/runtime';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {fireEvent, waitFor, render, screen} from '@testing-library/react';
import * as Cookies from '../cookies.js';

test('Set and get cookie', () => {
    var cookieName = 'jest_cookie_test';
    var testVal = "cookie's expected result";
    Cookies.setCookie(cookieName, testVal);
    var cookieVal = Cookies.getCookie(cookieName);
    expect(cookieVal).toBe(testVal);
});

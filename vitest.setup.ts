import '@testing-library/jest-dom'; // Keep this one if you want general jest-dom setup
                                    // OR, if you only need extend-expect, just the one below is fine.
                                    // Many setups just use the one below.

// For @testing-library/jest-dom v6+
import { expect } from 'vitest'; // Import expect from vitest
import * as matchers from '@testing-library/jest-dom/matchers'; // Import the matchers
expect.extend(matchers); // Extend vitest's expect with jest-dom matchers


import { vi } from "vitest";

// Optional: Mock global browser APIs if needed for some tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), 
    removeListener: vi.fn(), 
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
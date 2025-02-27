/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import pako from 'pako';
/**
 * Get environment variables from window.config or import.meta.env
 * @returns the environment variables
 */
declare global {
  interface Window {
    config: Record<string, any>;
  }
}
export const env = (() => {
  if (typeof window !== 'undefined') {
    return Object.keys(window.config || {}).length === 0 ? import.meta.env : window.config;
  }
  return import.meta.env;
})();

/**
 * Combine multiple classes into one string
 * @param classes - the classes to combine
 * @returns the combined class names
 * @example
 * const classNames = ['btn', 'btn-primary', 'btn-lg'];
 * const combinedClassNames = classNames(...classNames);
 * console.log(combinedClassNames); // btn btn-primary
 */
export function classNames(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}

/**
 * Omit keys from object
 * @param obj - the object to omit keys from
 * @param keys - the keys to omit
 * @returns the object with the omitted keys
 * @example
 * const obj = { name: 'John', age: 30, division: 'HR', department: 'IT' };
 * const omittedObj = omit(obj, ['age', 'department']);
 * console.log(omittedObj); // { name: 'John', division: 'HR' }
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

/**
 * Get username from email
 * @param email - the email
 * @returns the username
 * @example
 * const email = 'test.name@example';
 * const username = getUsername(email);
 * console.log(username); // Test Name
 */
export function getUsername(email: string) {
  return email
    .split('@')[0]
    .split('.')
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
    .join(' ');
}

/**
 * Get query params from URLSearchParams
 * @param searchParams - the URLSearchParams object
 * @returns the query params
 * @example
 * const searchParams = new URLSearchParams('?name=John&age=30&division=HR&division=IT');
 * const queryParams = getQueryParams(searchParams);
 * console.log(queryParams); // { name: 'John', age: '30', division: ['HR', 'IT'] }
 */
export const getQueryParams = (searchParams: URLSearchParams) => {
  const params = [...searchParams.entries()].reduce((acc, tuple) => {
    const [key, val] = tuple;
    if (Object.prototype.hasOwnProperty.call(acc, key)) {
      if (Array.isArray(acc[key])) {
        acc[key] = [...acc[key], val];
      } else {
        acc[key] = [acc[key], val];
      }
    } else {
      acc[key] = val;
    }

    return acc;
  }, {} as any);
  return cleanObject(params);
};

/**
 * Clean object from undefined, null, or empty string
 * @param obj - the object to clean
 * @returns the cleaned object
 * @example
 * const obj = { name: 'John', age: '', division: null, department: undefined };
 * const cleanedObj = cleanObject(obj);
 * console.log(cleanedObj); // { name: 'John' }
 */
export function cleanObject(obj: Record<string, any>) {
  return Object.keys(obj).reduce(
    (prev: Record<string, any>, key) => {
      const val = obj[key];
      if (val !== undefined && val !== null && val !== '') {
        prev[key] = val;
      }
      return prev;
    },
    {} as Record<string, any>
  );
}

/**
 * Extract filename from S3 key
 * @param key - the S3 key
 * @returns the filename
 * @example
 * const key = 'path/to/file.txt';
 * const filename = getFilenameFromKey(key);
 * console.log(filename); // file.txt
 */
export const getFilenameFromKey = (key: string): string => {
  return key.split('/').pop() || '';
};

/**
 * Sleep function to pause the execution for a while
 * @param timeout - the time to sleep in milliseconds
 * @returns a promise that resolves after the sleep
 * @example
 * const sleep = (timeout?: number) =>
 * new Promise((resolve) => setTimeout(resolve, timeout || 0));
 */
export const sleep = (timeout?: number) =>
  new Promise((resolve) => setTimeout(resolve, timeout || 0));

/**
 * Decompress base64 gzip
 * @param base64gz - the base64 gzip
 * @returns the decompressed content
 * @example
 * const decompressed = decompressBase64('base64gz');
 * console.log(decompressed); // decompressed content
 */
export const decompressBase64gz = (b64gz: string): string => {
  try {
    // Decode base64 safely
    const binaryString = atob(b64gz);

    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Use pako to inflate the gzipped content
    const decompressed = pako.inflate(bytes, { to: 'string' });
    return decompressed;
  } catch (error) {
    console.error('Error decompressing content:', error);
    return 'Error: Failed to decompress content';
  }
};

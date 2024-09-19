/* eslint-disable @typescript-eslint/no-explicit-any */

// combine multiple classes into one string
export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// get username from email
// example: test.name@example -> Test Name

export function getUsername(email: string) {
  return email
    .split('@')[0]
    .split('.')
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
    .join(' ');
}

// a function to get quey params from URLSearchParams
// example: ?name=John&age=30&division=HR&division=IT
// output: { name: 'John', age: '30', division: ['HR', 'IT'] }
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

// clean object from undefined, null, or empty string
// example: { name: 'John', age: ''}
// output: { name: 'John' }

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
 */
export const getFilenameFromKey = (key: string): string => {
  return key.split('/').pop() || '';
};

/* a sleep functon to pause the execution for a while */
export const sleep = (timeout?: number) =>
  new Promise((resolve) => setTimeout(resolve, timeout || 0));

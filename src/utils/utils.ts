// combine multiple classes into one string
export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

/*
  get username from email
  example: test.name@example -> Test Name
*/
export function getUsername(email: string) {
  return email
    .split('@')[0]
    .split('.')
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
    .join(' ');
}

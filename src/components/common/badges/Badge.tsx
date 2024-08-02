export interface BadgeProps {
  children: React.ReactNode;
  type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'abort';
}
const Badge = ({ children, type = 'primary' }: BadgeProps) => {
  const baseStyles = 'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ';
  const colorStyles: { [key: string]: string } = {
    primary: 'text-white bg-blue-700 ',
    secondary: 'text-blue-700 bg-blue-50 ring-1 ring-inset ring-blue-700/10 ',
    success: 'text-white bg-green-700 ',
    fail: 'text-white bg-red-700 ',
    warning: 'text-white bg-yellow-400 ',
    abort: 'text-gray-600 bg-grey-100 ',
  };

  return <span className={`${baseStyles} ${colorStyles[type]}`}>{children}</span>;
};

export default Badge;

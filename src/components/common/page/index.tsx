import { useEffect, ReactNode } from 'react';

type Props = {
  title?: string;
  children?: ReactNode;
};
const Page = ({ title, children }: Props) => {
  useEffect(() => {
    document.title = title || 'MineMetrics';
  }, [title]);
  return children;
};

export default Page;

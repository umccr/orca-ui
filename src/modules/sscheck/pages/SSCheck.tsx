import { SSChecker } from '../components/SSChecker';

export default function SSCheckPage() {
  return (
    <div className='flex max-w-(--breakpoint-sm) flex-col'>
      <h1 className='mb-4 font-bold'>Sample Sheet Checker</h1>
      <SSChecker />
    </div>
  );
}

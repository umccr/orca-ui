import { SSChecker } from '../components/SSChecker';

export default function SSCheckPage() {
  return (
    <div className='flex flex-col max-w-screen-sm'>
      <h1 className='mb-4 font-bold'>Sample Sheet Checker</h1>
      <SSChecker />
    </div>
  );
}

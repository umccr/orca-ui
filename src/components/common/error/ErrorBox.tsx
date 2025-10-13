type Props = { message: string };

export default function ErrorBox({ message }: Props) {
  return (
    <div className='rounded-md bg-red-50 p-4 dark:bg-red-900/10'>
      <pre className='font-mono text-sm break-words whitespace-pre-wrap text-red-600 dark:text-red-400'>
        {message}
      </pre>
    </div>
  );
}

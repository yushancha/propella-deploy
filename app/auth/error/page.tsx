import ErrorMessage from './ErrorMessage';

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 text-center">
        <ErrorMessage />
      </div>
    </div>
  );
}

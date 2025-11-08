interface ErrorComponentProps {
  error: Error;
}

export default function ErrorComponent({ error }: ErrorComponentProps) {
  return (
    <div className="flex justify-center items-center bg-gray-50 p-4 min-h-screen">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-2xl">
        <h1 className="mb-4 font-bold text-red-600 text-2xl">
          Application Error
        </h1>
        <div className="bg-red-50 mb-4 p-4 border border-red-200 rounded-md">
          <p className="mb-2 font-semibold text-red-800">Error Message:</p>
          <p className="text-red-700">{error.message}</p>
        </div>
        {error.message.includes('not valid JSON') && (
          <div className="bg-yellow-50 mb-4 p-4 border border-yellow-200 rounded-md">
            <p className="mb-2 font-semibold text-yellow-800">
              ⚠️ Configuration Issue
            </p>
            <p className="mb-2 text-yellow-700">
              It looks like your API configuration is missing or incorrect.
            </p>
            <ol className="space-y-1 ml-2 text-yellow-700 list-decimal list-inside">
              <li>
                Create a{' '}
                <code className="bg-yellow-100 px-1 rounded">.env</code> file in
                the root directory
              </li>
              <li>
                Copy the contents from{' '}
                <code className="bg-yellow-100 px-1 rounded">.env.example</code>
              </li>
              <li>
                Add your LiteAPI key to{' '}
                <code className="bg-yellow-100 px-1 rounded">VITE_API_KEY</code>
              </li>
              <li>Restart the development server</li>
            </ol>
          </div>
        )}
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold text-white"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}


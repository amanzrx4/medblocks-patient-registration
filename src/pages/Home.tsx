import { REPOSITORY_GITHUB_URL } from '@/utils'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to MedBlocks Patient Registration
          </h1>
          <p className="text-xl text-gray-600">
            A modern solution for managing patient registrations
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Available Routes
          </h2>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="text-lg font-medium text-gray-800">
                Patient Registration
              </h3>
              <p className="text-gray-600 mt-1">
                Register new patients into the system
              </p>
              <code className="mt-2 inline-block bg-gray-100 px-3 py-1 rounded text-sm font-mono text-gray-800">
                /patient-registration
              </code>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="text-lg font-medium text-gray-800">
                Patient Records
              </h3>
              <p className="text-gray-600 mt-1">
                View and query existing patient records
              </p>
              <code className="mt-2 inline-block bg-gray-100 px-3 py-1 rounded text-sm font-mono text-gray-800">
                /patient-records/sql
                <br />
                /patient-records/simple
              </code>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            For more information, check out our{' '}
            <a
              href={REPOSITORY_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GitHub Repository
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

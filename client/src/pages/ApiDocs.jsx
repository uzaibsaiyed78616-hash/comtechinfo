export default function ApiDocs() {
  return (
    <div className="p-6">

      <h2 className="text-xl font-bold mb-4">API Documentation</h2>

      <div className="bg-white p-4 rounded shadow">

        <p className="font-bold">Send Message API</p>

        <code className="block bg-gray-100 p-2 mt-2">
          /api/send-msg
        </code>

        <p className="mt-3 font-bold">Request Body</p>

        <pre className="bg-gray-100 p-2">
{`{
  "number": "9016xxxxxx",
  "message": "Hello"
}`}
        </pre>

      </div>

    </div>
  );
}
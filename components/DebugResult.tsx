// export default function DebugResult({ result, loading }: { result: any; loading: boolean }) {
//   if (loading) return <p className="text-center">Analyzing with Gemini...</p>;
//   if (!result) return null;

//   return (
//     <div className="bg-gray-900 p-6 rounded-xl">
//       <h3 className="text-lg font-bold">Errors</h3>
//       <p className="mb-4">{result.errors}</p>

//       <h3 className="text-lg font-bold">Suggestions</h3>
//       <p className="mb-4">{result.suggestions}</p>

//       <h3 className="text-lg font-bold">Fixed Code</h3>
//       <pre className="bg-black p-4 rounded">{result.fixedCode}</pre>
//     </div>
//   );
// }

"use client";

function toList(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((x) => String(x));
  if (typeof value === "string") return [value];
  return [JSON.stringify(value)];
}

export default function DebugResult({
  result,
  loading,
}: {
  result: any;
  loading: boolean;
}) {
  if (loading)
    return <p className="text-yellow-400 text-center">⏳ Analyzing with Gemini...</p>;

  if (!result) return null;

  const errors = result?.errors || [];
  const suggestions = result?.suggestions || [];
  const fixedCode = result?.fixedCode || "";

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-md mt-6">
      <h2 className="text-2xl font-bold text-white mb-4">Debug Result</h2>

      {/* Errors */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-red-400 mb-3">
          Errors / Issues Found
        </h3>

        {errors.length === 0 ? (
          <p className="text-gray-300 text-sm">No issues found.</p>
        ) : (
          errors.map((e: any, index: number) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-red-900/30 border border-red-700 mb-3"
            >
              <h4 className="text-red-200 font-bold text-lg">
                {index + 1}. {e.title || "Issue"}
              </h4>

              <div className="mt-3">
                <p className="text-sm font-semibold text-white">What happened?</p>
                <ul className="list-disc list-inside text-sm text-gray-200 mt-1 space-y-1">
                  {toList(e.whatHappened).map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-3">
                <p className="text-sm font-semibold text-white">Root cause</p>
                <ul className="list-disc list-inside text-sm text-gray-200 mt-1 space-y-1">
                  {toList(e.rootCause).map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-3">
                <p className="text-sm font-semibold text-white">Where</p>
                <p className="text-sm text-gray-200 mt-1">
                  {e.where || "Not specified"}
                </p>
              </div>

              <div className="mt-3">
                <p className="text-sm font-semibold text-green-300">How to fix</p>
                <ul className="list-disc list-inside text-sm text-gray-200 mt-1 space-y-1">
                  {toList(e.howToFix).map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Suggestions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-3">
          Suggestions / Improvements
        </h3>

        {suggestions.length === 0 ? (
          <p className="text-gray-300 text-sm">No suggestions.</p>
        ) : (
          <ul className="list-disc list-inside text-sm text-gray-200 space-y-1">
            {suggestions.map((s: string, i: number) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Fixed Code */}
      <div>
        <h3 className="text-lg font-semibold text-green-400 mb-3">
          Fixed / Correct Code
        </h3>

        <pre className="bg-black p-4 rounded-lg overflow-x-auto text-sm text-green-200 border border-gray-700 whitespace-pre-wrap">
          {fixedCode}
        </pre>
      </div>
    </div>
  );
}
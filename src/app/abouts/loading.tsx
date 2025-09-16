export default function Loading() {
  const lines = [
    { width: '70%', indent: 0, hasEqual: true },
    { width: '0%', indent: 0 },
    { width: '60%', indent: 0, hasEqual: true },
    { width: '0%', indent: 0 },
    { width: '40%', indent: 0, hasEqual: true },
    { width: '45%', indent: 1 },
    { width: '35%', indent: 1 },
    { width: '30%', indent: 1 },
    { width: '40%', indent: 1 },
    { width: '45%', indent: 1 },
    { width: '10%', indent: 0 },
  ];

  return (
    <pre className="!mt-0 bg-transparent p-0 text-sm leading-relaxed">
      <code className="block">
        {lines.map((line, index) => (
          <div key={index} className="flex h-6 items-center gap-4">
            <span className="inline-block w-5 text-right opacity-50">
              {index + 1}
            </span>
            <div
              className="flex-1"
              style={{ paddingLeft: `${line.indent * 20}px` }}
            >
              <div className="flex items-center gap-2">
                {line.width !== '0%' && (
                  <>
                    <div
                      className="h-4 animate-pulse rounded bg-[#898989]/10"
                      style={{ width: line.width }}
                    />
                    {line.hasEqual && (
                      <div className="h-4 w-4 animate-pulse rounded bg-[#898989]/10" />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </code>
    </pre>
  );
}

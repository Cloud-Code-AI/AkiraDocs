import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardIcon, CheckIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const generateCode = (language, server, method, path, parameters, requestBody, includedParams) => {
  const url = `${server.url}/${path}`;
  const queryParams = parameters
    ?.filter(p => p.in === 'query' && (p.required || includedParams.includes(p.name)))
    .map(p => `${p.name}=${p.schema.default || '{value}'}`)
    .join('&');
  const fullUrl = queryParams ? `${url}?${queryParams}` : url;

  switch (language) {
    case 'javascript':
      return generateJavaScriptCode(fullUrl, method, requestBody);
    case 'python':
      return generatePythonCode(fullUrl, method, requestBody);
    case 'curl':
      return generateCurlCode(fullUrl, method, requestBody);
    default:
      return '';
  }
};

const generateJavaScriptCode = (url, method, requestBody) => {
  let code = `fetch('${url}'`;
  if (method !== 'get') {
    code += `, {
  method: '${method.toUpperCase()}',
  headers: {
    'Content-Type': 'application/json'${requestBody ? ',\n    \'X-API-Key\': \'YOUR_API_KEY\'' : ''}
  }${requestBody ? `,
  body: JSON.stringify({
    // Add request body here
  })` : ''}
}`;
  }
  code += `)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`;

  return code;
};

const generatePythonCode = (url, method, requestBody) => {
  let code = `import requests

url = '${url}'
${requestBody ? "headers = {'X-API-Key': 'YOUR_API_KEY'}" : ''}
${requestBody ? `
data = {
    # Add request body here
}` : ''}

response = requests.${method}(url${requestBody ? ', headers=headers, json=data' : ''})
print(response.json())`;

  return code;
};

const generateCurlCode = (url, method, requestBody) => {
  let code = `curl -X ${method.toUpperCase()} '${url}'`;
  if (requestBody) {
    code += ` \\\n  -H 'Content-Type: application/json' \\\n  -H 'X-API-Key: YOUR_API_KEY' \\\n  -d '{
    // Add request body here
  }'`;
  }

  return code;
};

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      {copied ? (
        <CheckIcon className="h-5 w-5 text-green-500" />
      ) : (
        <ClipboardIcon className="h-5 w-5" />
      )}
    </button>
  );
};

const ParameterToggle = ({ param, isIncluded, onToggle }) => (
  <button
    onClick={() => onToggle(param.name)}
    className="p-1 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
  >
    {isIncluded ? (
      <MinusIcon className="h-4 w-4 text-red-500" />
    ) : (
      <PlusIcon className="h-4 w-4 text-green-500" />
    )}
  </button>
);

export function ApiUsage({ apiSpec }) {
  if (!apiSpec || !apiSpec.servers || !apiSpec.paths) {
    return null; // Return null if there's no data to display
  }

  const { servers, paths } = apiSpec;
  const [activeTab, setActiveTab] = useState('javascript');
  const [includedParams, setIncludedParams] = useState({});

  const toggleParam = (endpointId, paramName) => {
    setIncludedParams(prev => {
      const endpointParams = prev[endpointId] || [];
      if (endpointParams.includes(paramName)) {
        return { ...prev, [endpointId]: endpointParams.filter(p => p !== paramName) };
      } else {
        return { ...prev, [endpointId]: [...endpointParams, paramName] };
      }
    });
  };

  return (
    <div className="space-y-6">
      {Object.entries(paths).map(([path, methods]) => 
        Object.entries(methods).map(([method, details]) => {
          const endpointId = `${method}-${path}`;
          const endpointIncludedParams = includedParams[endpointId] || [];
          const optionalParameters = details.parameters?.filter(p => !p.required) || [];

          return (
            <Card key={endpointId} className="p-0 m-0 border-none shadow-none">
              <CardContent>
                <Tabs defaultValue="javascript" onValueChange={setActiveTab}>
                  <div className="flex justify-between items-center m-0">
                    <TabsList className="grid grid-cols-3 w-[300px]">
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                      <TabsTrigger value="curl">cURL</TabsTrigger>
                    </TabsList>
                    <CopyButton 
                      text={generateCode(activeTab, servers[0], method, path, details.parameters, details.requestBody, endpointIncludedParams)}
                    />
                  </div>
                  <div className="max-w-full mt-4">
                    {['javascript', 'python', 'curl'].map(lang => (
                      <TabsContent key={lang} value={lang}>
                        <SyntaxHighlighter 
                          language={lang === 'curl' ? 'bash' : lang}
                          style={prism} 
                          customStyle={{
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            padding: '1rem',
                            backgroundColor: 'rgb(246, 248, 250)',
                          }}
                          wrapLines={true}
                          wrapLongLines={true}
                          lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}
                        >
                          {generateCode(lang, servers[0], method, path, details.parameters, details.requestBody, endpointIncludedParams)}
                        </SyntaxHighlighter>
                      </TabsContent>
                    ))}
                  </div>
                </Tabs>
                {optionalParameters.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Optional Parameters:</h4>
                    <div className="flex flex-wrap gap-2">
                      {optionalParameters.map(param => (
                        <div key={param.name} className="flex items-center space-x-2">
                          <ParameterToggle
                            param={param}
                            isIncluded={endpointIncludedParams.includes(param.name)}
                            onToggle={(paramName) => toggleParam(endpointId, paramName)}
                          />
                          <span className="text-sm">{param.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
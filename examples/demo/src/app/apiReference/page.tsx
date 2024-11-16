"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Tabs} from 'akiradocs-ui';
import { ChartBarIcon, ArrowTrendingUpIcon, ShieldCheckIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { ApiUsage } from './apiUsage';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { get_api_spec, getApiNavigation } from '@/lib/content';
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
// import { Sidebar } from '@/components/layout/Sidebar'
// import { SEO } from '@/components/layout/SEO'
import { getFooterConfig } from '@/lib/footerConfig';
import { getHeaderConfig } from '@/lib/headerConfig';
import { ApiSidebar } from '@/components/layout/Navigation';

const Badge = ({ children, color }) => (
  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${color} mr-2`}>
    {children}
  </span>
);

const MethodBadge = ({ method }) => {
  const colors = {
    get: 'bg-green-100 text-green-800',
    post: 'bg-blue-100 text-blue-800',
    put: 'bg-yellow-100 text-yellow-800',
    patch: 'bg-orange-100 text-orange-800',
    delete: 'bg-red-100 text-red-800',
  };

  return (
    <Badge color={colors[method.toLowerCase()] || 'bg-gray-100 text-gray-800'}>
      {method.toUpperCase()}
    </Badge>
  );
};

const Parameter = ({ param }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hasDetails = param.description || (param.schema && (param.schema.enum || param.schema.default));
  
  const renderContent = () => (
    <div className="flex items-center">
      <strong className="mr-2 text-foreground">{param.name}</strong>
      <Badge color={param.in === 'query' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}>
        {param.in}
      </Badge>
      {param.required && (
        <Badge color="bg-red-100 text-red-800">required</Badge>
      )}
    </div>
  );

  if (!hasDetails) {
    return (
      <li className="mb-2 border rounded-md p-3">
        {renderContent()}
      </li>
    );
  }

  return (
    <motion.li 
      className="mb-2 border rounded-md overflow-hidden"
      initial={false}
      animate={{ backgroundColor: isExpanded ? "hsl(var(--secondary))" : "hsl(var(--background))" }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {renderContent()}
        {isExpanded ? (
          <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={{
              expanded: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.3 }}
            className="px-3 pb-3 text-sm text-gray-600"
          >
            {param.description && <p>{param.description}</p>}
            {param.schema && param.schema.enum && (
              <p className="mt-2">
                <span className="font-semibold">Possible values:</span> 
                <span className="ml-2">
                  {param.schema.enum.map((value, index) => (
                    <Badge key={index} color="bg-blue-100 text-blue-800">{value}</Badge>
                  ))}
                </span>
              </p>
            )}
            {param.schema && param.schema.default && (
              <p className="mt-2">
                <span className="font-semibold">Default:</span> 
                <span className="ml-2">
                  <Badge color="bg-yellow-100 text-yellow-800">{param.schema.default}</Badge>
                </span>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

const EndpointSection = ({ id, method, servers, path, summary, description, parameters, requestBody, security, isProd, insights, ...rest }) => (
  <section id={id} className="mb-8 flex flex-col lg:flex-row gap-6">
    <div className="lg:w-[65%] h-full border rounded-lg overflow-hidden">
      <div className="bg-secondary p-4">
        <h3 className="text-xl text-foreground font-semibold mb-2">{summary}</h3>
        <p className="text-muted-foreground mb-2 flex items-center">
          <MethodBadge method={method} />
          <code className="ml-2 text-sm bg-foreground/10 px-2 py-1 rounded">{path}</code>
        </p>
        <p className="text-sm text-muted-foreground">{description}</p>
        {security && security.length > 0 && (
          <p className="mt-2"><Badge color="bg-yellow-100 text-yellow-800">Requires Authentication</Badge></p>
        )}
      </div>
      
      {parameters && parameters.length > 0 && (
        <div className="p-4">
          <h4 className="font-semibold mb-3">Parameters:</h4>
          <ul className="space-y-2">
            {parameters.map((param, index) => (
              <Parameter key={index} param={param} />
            ))}
          </ul>
        </div>
      )}
      
      {/* {requestBody && (
        <div className="p-4 border-t border-gray-200">
          <h4 className="font-semibold mb-2">Request Body:</h4>
          <p className="text-sm">JSON object containing:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            {Object.entries(requestBody.content['application/json'].schema.properties).map(([key, value]) => (
              <li key={key} className="text-sm">
                <code className="bg-gray-100 px-1 py-0.5 rounded">{key}</code>
                {value.type && <span className="text-gray-600 ml-2">({value.type})</span>}
                {value.description && <span className="text-gray-600 ml-2">- {value.description}</span>}
              </li>
            ))}
          </ul>
        </div>
      )} */}
      
      {!isProd && insights && (
        <div className="p-6 border-t bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30">
          <h4 className="text-lg font-semibold mb-4 text-teal-700 dark:text-teal-400">Development Insights</h4>
          
          {insights.performance_insights && (
            <div className="mb-4 bg-background rounded-lg p-4 shadow-sm border border-teal-100 dark:border-teal-900/50">
              <h5 className="font-medium text-sm mb-2 flex items-center text-teal-600 dark:text-teal-400">
                <ChartBarIcon className="h-5 w-5 mr-2" />
                Performance Insights
              </h5>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                {insights.performance_insights.map((insight, index) => (
                  <li key={index}>
                    <strong>{insight.insight}:</strong> {insight.recommendation}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {insights.security_insights && (
            <div className="mb-4 bg-background rounded-lg p-4 shadow-sm border border-teal-100 dark:border-teal-900/50">
              <h5 className="font-medium text-sm mb-2 flex items-center text-teal-600 dark:text-teal-400">
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                Security Insights
              </h5>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                {insights.security_insights.map((insight, index) => (
                  <li key={index}>
                    <strong>{insight.insight}:</strong> {insight.recommendation}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {insights.optimization_insights && (
            <div className="mb-4 bg-background rounded-lg p-4 shadow-sm border border-teal-100 dark:border-teal-900/50">
              <h5 className="font-medium text-sm mb-2 flex items-center text-teal-600 dark:text-teal-400">
                <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
                Optimization Insights
              </h5>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                {insights.optimization_insights.map((insight, index) => (
                  <li key={index}>
                    <strong>{insight.insight}:</strong> {insight.recommendation}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {insights.additional_metadata && (
            <div className="bg-background rounded-lg p-4 shadow-sm border border-teal-100 dark:border-teal-900/50">
              <h5 className="font-medium text-sm mb-2 flex items-center text-teal-600 dark:text-teal-400">
                <InformationCircleIcon className="h-5 w-5 mr-2" />
                Additional Metadata
              </h5>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                {Object.entries(insights.additional_metadata).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {
                      typeof value === 'object' 
                        ? JSON.stringify(value) 
                        : value
                    }
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
    <div className="lg:w-[35%]">
      <ApiUsage apiSpec={{ servers: servers, paths: { [path]: { [method]: { parameters, requestBody } } } }} />
    </div>
  </section>
);

function Documentation({ }) {
  const [apiSpec, setApiSpec] = useState(null)
  const [activeTab, setActiveTab] = useState('formatted');
  const textareaRef = useRef(null);
  const headerConfig = getHeaderConfig();
  const footerConfig = getFooterConfig();
  const locale = 'en'

  const FormattedDocs = useCallback(() => (
    <>
      {Object.entries(apiSpec.paths).map(([path, methods]) => 
        Object.entries(methods).map(([method, details]) => (
          <EndpointSection 
            key={`${method}-${path}`}
            id={`${method}-${path}`}
            servers={apiSpec.servers}
            method={method}
            path={path}
            {...details}
            isProd={true}
          />
        ))
      )}
    </>
  ), [apiSpec]);


  useEffect(() => {
    setApiSpec(get_api_spec())
  }, [])

  useEffect(() => {
    if (textareaRef.current && apiSpec) {
      textareaRef.current.value = JSON.stringify(apiSpec, null, 2);
    }
  }, [apiSpec]);

  if (!apiSpec) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header {...headerConfig} currentLocale={locale} />
      <div className="flex flex-1">
        <ApiSidebar />
        <main className="flex-1 h-full overflow-y-auto pt-6 px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h1 className="text-2xl font-bold">{apiSpec.info.title}</h1>
                    <Badge color="bg-blue-100 text-blue-800">v{apiSpec.info.version}</Badge>
                  </div>
                  {apiSpec.info.description && (
                    <p className="text-gray-600 max-w-2xl">{apiSpec.info.description}</p>
                  )}
                </div>
              </div>
            </div>
            <FormattedDocs />
          </Tabs>
        </main>
      </div>
      <Footer {...footerConfig} />
    </div>
  );
}

export default function Page() {
  return <Documentation />;
}
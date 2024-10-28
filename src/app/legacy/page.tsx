import { Header } from '@/components/content/layout/Header';
import Footer from '@/components/content/layout/Footer';
import Navigation from '@/components/content/layout/Navigation';
import MainContent from '@/app/legacy/MainContent';
import TableOfContents from '@/components/content/layout/TableOfContents';
import { getHeaderConfig } from '@/lib/headerConfig';

export default function LegacyDocs() {
    const headerConfig = getHeaderConfig();
    
    const dummyContent = `
<h1>Welcome to Our Documentation</h1>

<p>This is an example of our documentation page with various elements to showcase the DocumentationView component.</p>

<h2 id="getting-started">Getting Started</h2>

<p>Let's begin with a simple introduction to our product. Here's a list of key features:</p>

<ul>
  <li>Easy to use interface</li>
  <li>Powerful analytics</li>
  <li>Customizable dashboards</li>
  <li>Integrations with popular tools</li>
</ul>

<h2 id="installation">Installation</h2>

<p>To install our product, you can use npm:</p>

<pre><code class="language-bash">npm install our-awesome-product</code></pre>

<h2 id="basic-usage">Basic Usage</h2>

<p>Here's a simple example of how to use our product:</p>

<pre><code class="language-javascript">
import { AwesomeProduct } from 'our-awesome-product';

const myProduct = new AwesomeProduct();
myProduct.doSomethingCool();
</code></pre>

<h2 id="advanced-features">Advanced Features</h2>

<p>Our product comes with several advanced features for power users.</p>

<h3 id="custom-plugins">Custom Plugins</h3>

<p>You can extend the functionality of our product by creating custom plugins.</p>

<h3 id="api-integration">API Integration</h3>

<p>Integrate with our RESTful API for more control and automation.</p>

<h2 id="troubleshooting">Troubleshooting</h2>

<p>If you encounter any issues, please check our <a href="#faq">FAQ</a> section or contact our support team.</p>

<h2 id="faq">Frequently Asked Questions</h2>

<p>Here are some common questions and answers:</p>

<ol>
  <li><strong>Q: How do I reset my password?</strong><br>A: You can reset your password by clicking on the "Forgot Password" link on the login page.</li>
  <li><strong>Q: Is there a mobile app available?</strong><br>A: Yes, we have mobile apps for both iOS and Android platforms.</li>
</ol>

<h2 id="changelog">Changelog</h2>

<p>Keep track of our latest updates and improvements:</p>

<table>
  <thead>
    <tr>
      <th>Version</th>
      <th>Date</th>
      <th>Changes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>2.0.0</td>
      <td>2023-06-15</td>
      <td>Major redesign and performance improvements</td>
    </tr>
    <tr>
      <td>1.5.0</td>
      <td>2023-03-01</td>
      <td>Added new analytics dashboard</td>
    </tr>
  </tbody>
</table>
`

const navigationItems = {
  gettingStarted: {
    title: "Getting Started",
    path: "/docs/getting-started",
    items: {
      installation: { title: "Installation", path: "/docs/getting-started/installation" },
      configuration: { title: "Configuration", path: "/docs/getting-started/configuration" },
      projectStructure: { title: "Project Structure", path: "/docs/getting-started/project-structure" },
    },
  },
  coreConcepts: {
    title: "Core Concepts",
    path: "/docs/core-concepts",
    items: {
      routing: { title: "Routing", path: "/docs/core-concepts/routing" },
      dataFetching: { 
        title: "Data Fetching", 
        path: "/docs/core-concepts/data-fetching",
        items: {
          serverSide: { title: "Server-side", path: "/docs/core-concepts/data-fetching/server-side" },
          clientSide: { title: "Client-side", path: "/docs/core-concepts/data-fetching/client-side" },
        }
      },
      // ... other items
    },
  },
  // ... other top-level items
};

const footerData = {
  companyName: "Cloud Code AI",
  socialLinks: [
    { name: "GitHub", url: "https://github.com/your-repo", icon: "/github.svg" },
    { name: "Twitter", url: "https://twitter.com/your-account", icon: "/twitter.svg" },
    { name: "LinkedIn", url: "https://linkedin.com/company/your-company", icon: "/linkedin.svg" },
  ],
  madeWithLove: true
}

    return (
        <div className="flex flex-col h-screen">
            <Header 
                logo={headerConfig.logo}
                title={headerConfig.title}
                showSearch={headerConfig.showSearch}
                searchPlaceholder={headerConfig.searchPlaceholder}
                navItems={headerConfig.navItems}
                socialLinks={headerConfig.socialLinks}
            />
            <div className="flex flex-grow">
                <Navigation items={navigationItems} />
                <div className="flex-1 flex">
                    <MainContent content={dummyContent} />
                    <TableOfContents />
                </div>
            </div>
            <Footer {...footerData} />
        </div>
    );
}

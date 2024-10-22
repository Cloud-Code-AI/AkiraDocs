import Footer from './components/Footer';
import { HeaderComponent } from './components/Header';
import Sidebar from '@/app/legacy/components/Sidebar';
import DocumentationView from '@/app/legacy/components/DocsView';

export default function LegacyDocs() {

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

const dummyTableOfContents = [
  { id: 'getting-started', title: 'Getting Started' },
  { id: 'installation', title: 'Installation' },
  { id: 'basic-usage', title: 'Basic Usage' },
  { id: 'advanced-features', title: 'Advanced Features' },
  { id: 'custom-plugins', title: 'Custom Plugins' },
  { id: 'api-integration', title: 'API Integration' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
  { id: 'faq', title: 'Frequently Asked Questions' },
  { id: 'changelog', title: 'Changelog' },
]
  return (
    <div className="flex flex-col h-screen">
      <HeaderComponent />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow p-8">
            <DocumentationView content={dummyContent} tableOfContents={dummyTableOfContents} />
        </main>
      </div>
      <Footer />
    </div>
  );
}

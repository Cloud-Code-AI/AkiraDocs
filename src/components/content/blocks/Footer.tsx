interface SocialLink {
    name: string;
    url: string;
    icon: string;
  }
  
  interface FooterProps {
    companyName: string;
    socialLinks: SocialLink[];
    madeWithLove: boolean;
  }
  
  export function Footer({ companyName, socialLinks, madeWithLove }: FooterProps) {
    return (
      <footer className="bg-gray-100 dark:bg-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} {companyName}
            {madeWithLove && <span className="ml-2">Made with ❤️</span>}
          </div>
          <div className="flex space-x-4">
            {socialLinks.map((link) => (
              <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
                <img src={link.icon} alt={link.name} className="h-6 w-6" />
              </a>
            ))}
          </div>
        </div>
      </footer>
    );
  }
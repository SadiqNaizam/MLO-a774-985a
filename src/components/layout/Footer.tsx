import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  console.log('Footer component loaded');

  const footerLinks = [
    { label: 'About Us', to: '/about' },
    { label: 'Contact Support', to: '/contact' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Privacy Policy', to: '/privacy' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {currentYear} FoodieFleet. All rights reserved.</p>
          <p className="mt-1">
            Crafted with <span className="text-red-500">&hearts;</span> for food lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import FooterColumn from './FooterColumn';
import SocialIcons from './SocialIcons';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-300 bg-bg-light dark:bg-gray-600 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img
              src="https://i.ibb.co/N2jf7kL4/550265142-1124024862503275-6787426305608102088-n.png"
              alt="ShelfShare logo"
              className="h-9 w-9 rounded"
            />
            <span className="text-xl font-semibold text-text-main dark:text-white">ShelfShare</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors">
            Community, Exchange, and Sustainability for book lovers.
          </p>
        </div>

        {/* Columns */}
        <FooterColumn
          title="Platform"
          links={[
            { label: 'About Us', to: '/about' },
            { label: 'How It Works', to: '/how-it-works' },
            { label: 'Sustainability Mission', to: '/sustainability' },
          ]}
        />
        <FooterColumn
          title="Community"
          links={[
            { label: 'Leaderboard', to: '/leaderboard' },
            { label: 'Local Events', to: '/events' },
            { label: 'Blog', to: '/blog' },
          ]}
        />
        <FooterColumn
          title="Support"
          links={[
            { label: 'Help Center / FAQ', to: '/help' },
            { label: 'Contact Us', to: '/contact' },
            { label: 'Dispute Resolution', to: '/disputes' },
          ]}
        />
      </div>

      {/* Bottom Social & Copyright */}
      <div className="border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Social Icons */}
          <div className="flex gap-4">
           
            <SocialIcons />
          </div>

          {/* Copyright */}
          <p className="text-xs text-gray-700 dark:text-gray-300 transition-colors">
            © 2025 ShelfShare by Syntax Surfers!
          </p>
        </div>
      </div>
    </footer>
  );
}

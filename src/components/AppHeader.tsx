import { Mountain } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
export function AppHeader() {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      "text-sm font-medium transition-colors hover:text-primary",
      isActive ? "text-primary" : "text-muted-foreground"
    );
  return (
    <header className="py-4 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <NavLink to="/" className="flex items-center gap-2">
            <Mountain className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold font-display text-foreground">Zenith Ledger</span>
          </NavLink>
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <NavLink to="/" className={navLinkClasses}>
              Dashboard
            </NavLink>
            <NavLink to="/transactions" className={navLinkClasses}>
              Transactions
            </NavLink>
            <NavLink to="/analytics" className={navLinkClasses}>
              Analytics
            </NavLink>
            <NavLink to="/settings" className={navLinkClasses}>
              Settings
            </NavLink>
          </nav>
        </div>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
}
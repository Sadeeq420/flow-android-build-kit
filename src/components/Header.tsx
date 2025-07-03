
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

type HeaderProps = {
  user?: { email?: string } | null;
  onLogout?: () => void;
};

export const Header = ({ user, onLogout }: HeaderProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            Qumecs Procurement
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {user ? (
                  <>
                     <div className="text-sm text-muted-foreground mb-4">
                       Logged in as <span className="font-semibold">{user.email || 'Admin'}</span>
                     </div>
                    <Link
                      to="/"
                      className="px-3 py-2 text-base hover:bg-gray-100 rounded-md"
                      onClick={() => setOpen(false)}
                    >
                      Home
                    </Link>
                    <Link
                      to="/lpo-create"
                      className="px-3 py-2 text-base hover:bg-gray-100 rounded-md"
                      onClick={() => setOpen(false)}
                    >
                      Raise LPO
                    </Link>
                    <Link
                      to="/dashboard"
                      className="px-3 py-2 text-base hover:bg-gray-100 rounded-md"
                      onClick={() => setOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/email-report"
                      className="px-3 py-2 text-base hover:bg-gray-100 rounded-md"
                      onClick={() => setOpen(false)}
                    >
                      Send Report Email
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                      className="px-3 py-2 text-base text-red-600 hover:bg-red-50 rounded-md mt-4"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="px-3 py-2 text-base hover:bg-gray-100 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {user && (
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-sm font-medium hover:text-primary">
                Home
              </Link>
              <Link to="/lpo-create" className="text-sm font-medium hover:text-primary">
                Raise LPO
              </Link>
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
                Dashboard
              </Link>
              <Link to="/email-report" className="text-sm font-medium hover:text-primary">
                Send Report
              </Link>
            </nav>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User size={16} />
                  {user.email || 'Admin'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-sm text-muted-foreground">
                  {user.email || 'Admin'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, BarChart2, Mail } from 'lucide-react';

const MainDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Options for the main dashboard
  const options = [
    {
      id: 'lpo',
      title: 'Raise LPO',
      description: 'Create a new Local Purchase Order',
      icon: <ClipboardList className="h-12 w-12 mb-4 text-primary" />,
      action: () => navigate('/lpo-create')
    },
    {
      id: 'dashboard',
      title: 'View Dashboard',
      description: 'View procurement analytics and reports',
      icon: <BarChart2 className="h-12 w-12 mb-4 text-primary" />,
      action: () => navigate('/dashboard')
    },
    {
      id: 'report',
      title: 'Send Report Email',
      description: 'Schedule and send procurement reports',
      icon: <Mail className="h-12 w-12 mb-4 text-primary" />,
      action: () => navigate('/email-report')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-muted to-background-subtle flex flex-col">
      <Header user={user} onLogout={logout} />

      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="text-center mb-16 animate-in">
          <h1 className="text-4xl font-bold gradient-text mb-4">Welcome, {user?.email || 'Admin'}</h1>
          <p className="text-foreground-muted text-lg">Select an action to continue with your procurement tasks</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {options.map((option, index) => (
            <Card 
              key={option.id} 
              className="hover-lift glass-card border-card-border/50 backdrop-blur-sm group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-col items-center pb-4 pt-8">
                <div className="mb-4 p-4 rounded-2xl bg-primary-muted group-hover:bg-primary-subtle transition-colors duration-300">
                  {option.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-center">{option.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <CardDescription className="text-center text-base text-foreground-muted leading-relaxed">
                  {option.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-center pt-2 pb-8">
                <Button 
                  onClick={option.action} 
                  className="silky-button bg-gradient-to-r from-primary to-primary-hover text-primary-foreground px-8 py-2.5"
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MainDashboard;

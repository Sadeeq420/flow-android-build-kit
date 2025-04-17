
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} onLogout={logout} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-gray-600 mt-2">Select an action to continue</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {options.map((option) => (
            <Card key={option.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-col items-center pb-2">
                {option.icon}
                <CardTitle className="text-xl">{option.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  {option.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-center pt-0">
                <Button onClick={option.action} variant="outline">
                  Select
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

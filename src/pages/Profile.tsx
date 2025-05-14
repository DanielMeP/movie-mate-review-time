
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from 'sonner';
import { ChevronLeft, Heart, Mail, User } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, connectPartner, logout } = useAuth();
  
  const [partnerEmail, setPartnerEmail] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  
  if (!currentUser) {
    navigate('/login');
    return null;
  }
  
  const handleConnectPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerEmail.trim()) {
      toast.error('Please enter your partner\'s email');
      return;
    }
    
    setIsConnecting(true);
    try {
      await connectPartner(partnerEmail);
      setPartnerEmail('');
    } catch (error) {
      // Error toast is handled in the context
      console.error('Error connecting partner:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-wine p-4 sticky top-0 z-10 shadow-md">
        <div className="container max-w-3xl mx-auto flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white mr-2 hover:bg-wine-light"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft />
          </Button>
          
          <h1 className="text-lg font-semibold text-white">Your Profile</h1>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="container max-w-md mx-auto p-4">
        {/* User Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="text-muted-foreground" size={18} />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{currentUser.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="text-muted-foreground" size={18} />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{currentUser.email}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={logout}
              variant="outline" 
              className="w-full"
            >
              Log Out
            </Button>
          </CardFooter>
        </Card>
        
        {/* Partner Connection Card */}
        <Card>
          <CardHeader>
            <CardTitle>Partner Connection</CardTitle>
            <CardDescription>
              Connect with your partner to share movie ratings and reviews.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {currentUser.partnerId ? (
              <div className="flex flex-col items-center py-4">
                <div className="h-16 w-16 bg-wine/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="text-wine" size={32} />
                </div>
                
                <h3 className="text-lg font-medium mb-1">Connected with {currentUser.partnerName}</h3>
                <p className="text-sm text-muted-foreground">{currentUser.partnerEmail}</p>
              </div>
            ) : (
              <form onSubmit={handleConnectPartner} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Partner's Email</label>
                  <Input 
                    type="email"
                    placeholder="Enter your partner's email"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-wine hover:bg-wine-dark"
                  disabled={isConnecting}
                >
                  {isConnecting ? "Connecting..." : "Connect with Partner"}
                </Button>
                
                {/* For Demo: Add a quick connect to the other demo user */}
                <div className="text-center pt-4">
                  <p className="text-xs text-muted-foreground mb-2">For demo purposes:</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setPartnerEmail(
                      currentUser.email === 'alex@example.com' 
                        ? 'jordan@example.com' 
                        : 'alex@example.com'
                    )}
                  >
                    Use Demo Partner
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

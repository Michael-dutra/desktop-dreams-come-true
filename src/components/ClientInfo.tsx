
import { User, MapPin, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ClientInfo = () => {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Michael</h1>
            <p className="text-muted-foreground">Here's your financial overview</p>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-semibold text-foreground">34 years</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Province</p>
                <p className="font-semibold text-foreground">Ontario</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Family</p>
                <p className="font-semibold text-foreground">Married, 2 kids</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInfo;

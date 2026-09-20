import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="max-w-md w-full text-center shadow-lg">
        <CardHeader>
          <XCircle className="mx-auto text-red-500 w-16 h-16" />
          <CardTitle className="text-2xl font-semibold mt-4">
            Payment Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Unfortunately, your payment could not be processed. Please try again
            or contact support.
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => navigate('/dashboard/my-cart')}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailure;

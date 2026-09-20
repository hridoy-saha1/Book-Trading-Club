import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="max-w-md w-full text-center shadow-lg">
        <CardHeader>
          <CheckCircle className="mx-auto text-green-500 w-16 h-16" />
          <CardTitle className="text-2xl font-semibold mt-4">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Thank you for your payment. Your transaction has been completed
            successfully.
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => navigate('/dashboard/my-orders')}>
              View Orders
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

export default PaymentSuccess;

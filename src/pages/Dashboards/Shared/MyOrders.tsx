import UseAxiosSecure from '@/axios/UseAxiosSecure';
import { useAuth } from '@/firebase/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

type Order = {
  _id: string;
  user: {
    _id: string;
    email: string;
    displayName: string;
  };
  book: {
    _id: string;
    title: string;
    author: string;
    ISBN: string;
    Exchange: string;
    price: number;
    imageUrl: string;
  };
  createdAt: string;
  updatedAt: string;
};

type OrderAPI = {
  error: boolean;
  message: string;
  data: Order[] | null;
};

const MyOrders = () => {
  const axiosSecure = UseAxiosSecure();
  const { dbUser } = useAuth();

  const { data: orders, isPending } = useQuery<OrderAPI>({
    queryKey: ['myOrders', dbUser?._id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/orders/${dbUser?._id}`);
      return res.data;
    },
    enabled: !!dbUser?._id,
  });

  if (isPending) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-6 w-1/3 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>

      {orders?.data && orders.data.length > 0 ? (
        orders.data.map((order) => (
          <Card key={order._id} className="shadow-sm border mb-10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {order?.book.title}
                </CardTitle>
                <Badge
                  variant={
                    order.book.Exchange === 'Swap'
                      ? 'default'
                      : order.book.Exchange === 'Donate'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {order.book.Exchange}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Ordered on {format(new Date(order.createdAt), 'dd MMM yyyy')}
              </p>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Left: Image */}
                <div className="flex justify-center md:justify-start">
                  <img
                    src={order.book.imageUrl}
                    alt={order.book.title}
                    className="w-32 h-44 object-cover rounded-md border"
                  />
                </div>

                {/* Right: Details */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Author</span>
                    <span className="text-sm text-muted-foreground">
                      {order.book.author}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">ISBN</span>
                    <span className="text-sm text-muted-foreground">
                      {order.book.ISBN}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Price</span>
                    <span className="text-sm text-muted-foreground">
                      ${order.book.price}
                    </span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between text-sm">
                    <span>Status</span>
                    <Badge>Delivered</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-muted-foreground">No orders found.</p>
      )}
    </div>
  );
};

export default MyOrders;

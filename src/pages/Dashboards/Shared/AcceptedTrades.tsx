import UseAxiosSecure from '@/axios/UseAxiosSecure';
import { useAuth } from '@/firebase/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

type Trade = {
  _id: string;
  sender: { _id: string; email: string; displayName: string; image: string };
  senderbook: {
    _id: string;
    title: string;
    author: string;
    price: number;
    imageUrl: string;
  };
  receiver: { _id: string; email: string; displayName: string; image: string };
  receiverbook: {
    _id: string;
    title: string;
    author: string;
    price: number;
    imageUrl: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
};

type TradeAPI = { error: string; data: Trade[]; message: string };

const AcceptedTrades = () => {
  const { dbUser } = useAuth();
  const axiosSecure = UseAxiosSecure();

  const {
    data: acceptedtrades,
    isLoading,
    isFetching,
  } = useQuery<TradeAPI>({
    queryKey: ['acceptedtrades', dbUser?._id],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/api/trades/accepted-trades/${dbUser?._id}`
      );
      return res.data;
    },
    enabled: !!dbUser?._id,
  });

  if (isLoading || isFetching) {
    return (
      <div className="p-6 grid gap-4">
        {[1, 2].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <Separator className="my-4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold mb-4">Accepted Trades</h1>

      {acceptedtrades?.data?.length === 0 && (
        <p className="text-muted-foreground text-center">
          No accepted trades found.
        </p>
      )}

      <div className="grid gap-6">
        {acceptedtrades?.data?.map((trade) => (
          <Card key={trade._id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Trade ID: {trade._id}</span>
                <span className="text-sm text-muted-foreground capitalize">
                  Status: {trade.status}
                </span>
              </CardTitle>
              <CardDescription>
                Accepted on {format(new Date(trade.updatedAt), 'PPpp')}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Sender Info */}
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  Sender Information
                </h2>
                <div className="flex items-center gap-4">
                  <img
                    src={trade.sender.image}
                    alt={trade.sender.displayName}
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                  <div>
                    <p className="font-medium">{trade.sender.displayName}</p>
                    <p className="text-sm text-muted-foreground">
                      {trade.sender.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      User ID: {trade.sender._id}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Receiver Info */}
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  Receiver Information
                </h2>
                <div className="flex items-center gap-4">
                  <img
                    src={trade.receiver.image}
                    alt={trade.receiver.displayName}
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                  <div>
                    <p className="font-medium">{trade.receiver.displayName}</p>
                    <p className="text-sm text-muted-foreground">
                      {trade.receiver.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      User ID: {trade.receiver._id}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Books Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Sender Book */}
                <div className="border rounded-xl p-4 flex flex-col md:flex-row gap-4">
                  <img
                    src={trade.senderbook.imageUrl}
                    alt={trade.senderbook.title}
                    className="w-24 h-32 rounded-lg object-cover border"
                  />
                  <div>
                    <h3 className="font-semibold">{trade.senderbook.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      by {trade.senderbook.author}
                    </p>
                    <p className="text-sm mt-1">
                      Price: ${trade.senderbook.price}
                    </p>
                    <p className="text-xs mt-1 text-muted-foreground">
                      Offered by Sender
                    </p>
                    <p className="text-xs mt-1 text-muted-foreground">
                      Book ID: {trade.senderbook._id}
                    </p>
                  </div>
                </div>

                {/* Receiver Book */}
                <div className="border rounded-xl p-4 flex flex-col md:flex-row gap-4">
                  <img
                    src={trade.receiverbook.imageUrl}
                    alt={trade.receiverbook.title}
                    className="w-24 h-32 rounded-lg object-cover border"
                  />
                  <div>
                    <h3 className="font-semibold">
                      {trade.receiverbook.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      by {trade.receiverbook.author}
                    </p>
                    <p className="text-sm mt-1">
                      Price: ${trade.receiverbook.price}
                    </p>
                    <p className="text-xs mt-1 text-muted-foreground">
                      Owned by Receiver
                    </p>
                    <p className="text-xs mt-1 text-muted-foreground">
                      Book ID: {trade.receiverbook._id}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="text-sm text-muted-foreground">
                Created on {format(new Date(trade.createdAt), 'PPpp')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AcceptedTrades;

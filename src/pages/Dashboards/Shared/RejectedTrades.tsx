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
import { Ban } from 'lucide-react';

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

const RejectedTrades = () => {
  const { dbUser } = useAuth();
  const axiosSecure = UseAxiosSecure();

  const {
    data: rejectedtrades,
    isLoading,
    isFetching,
  } = useQuery<TradeAPI>({
    queryKey: ['rejectedtrades', dbUser?._id],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/api/trades/rejected-trades/${dbUser?._id}`
      );
      return res.data;
    },
    enabled: !!dbUser?._id,
  });

  // ---- Loading skeleton ----
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

  // ---- Empty state ----
  if (!rejectedtrades?.data?.length) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Ban className="mx-auto mb-3 h-10 w-10 text-destructive" />
        <p>No rejected trades found.</p>
      </div>
    );
  }

  // ---- Main content ----
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <Ban className="text-destructive h-6 w-6" />
        Rejected Trades
      </h1>

      <div className="grid gap-6">
        {rejectedtrades.data.map((trade) => (
          <Card
            key={trade._id}
            className="overflow-hidden border-destructive/30 hover:border-destructive/50 transition-colors"
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Trade ID: {trade._id}</span>
                <span className="text-sm font-medium text-destructive capitalize">
                  {trade.status}
                </span>
              </CardTitle>
              <CardDescription>
                Rejected on {format(new Date(trade.updatedAt), 'PPpp')}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Sender Info */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Sender</h2>
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
                  </div>
                </div>
              </div>

              <Separator />

              {/* Receiver Info */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Receiver</h2>
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
                  </div>
                </div>
              </div>

              <Separator />

              {/* Books Info */}
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

export default RejectedTrades;

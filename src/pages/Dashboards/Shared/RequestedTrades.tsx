import UseAxiosSecure from '@/axios/UseAxiosSecure';
import { useAuth } from '@/firebase/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitPullRequest, ArrowLeftRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

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

const RequestedTrades = () => {
  const axiosSecure = UseAxiosSecure();
  const { dbUser } = useAuth();

  const { data: requestedtrades, isLoading, isFetching } = useQuery<TradeAPI>({
    queryKey: ['requestedtrades', dbUser?._id],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/api/trades/requested-trades/${dbUser?._id}`
      );
      return res.data;
    },
    enabled: !!dbUser?._id,
  });

  if (isLoading || isFetching)
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-5">
              <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 p-0">
                {/* Left side skeleton */}
                <div className="flex items-center gap-6 w-full md:w-2/3">
                  <div className="flex items-center gap-3 w-1/2">
                    <Skeleton className="w-14 h-20 rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>

                  <Skeleton className="w-6 h-6 rounded-full" />

                  <div className="flex items-center gap-3 w-1/2">
                    <Skeleton className="w-14 h-20 rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </div>

                {/* Right side skeleton */}
                <div className="flex flex-col md:items-end w-full md:w-1/3 gap-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>

                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-8 w-36 rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );

  const trades = requestedtrades?.data || [];

  return (
    <div className="p-6 space-y-6">
      {/* ===== Header ===== */}
      <div>
        <div className="flex items-center gap-2">
          <GitPullRequest className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Requested Trades
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Books you’ve requested to trade
        </p>
      </div>

      {/* ===== Empty State ===== */}
      {trades.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No requested trades found.
        </Card>
      ) : (
        <div className="space-y-4">
          {trades.map((trade, index) => (
            <motion.div
              key={trade._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border border-border/60 hover:border-primary/40 hover:bg-muted/30">
                <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 p-5">
                  {/* ===== Books Section ===== */}
                  <div className="flex items-center gap-6 w-full md:w-2/3">
                    {/* Sender Book */}
                    <div className="flex items-center gap-3 w-1/2">
                      <img
                        src={trade.senderbook.imageUrl}
                        alt={trade.senderbook.title}
                        className="w-14 h-20 rounded-md object-cover shadow-sm"
                      />
                      <div>
                        <p className="font-medium leading-tight">
                          {trade.senderbook.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {trade.senderbook.author}
                        </p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-center">
                      <div className="p-2 bg-muted rounded-full shadow-sm">
                        <ArrowLeftRight className="w-5 h-5 text-primary" />
                      </div>
                    </div>

                    {/* Receiver Book */}
                    <div className="flex items-center gap-3 w-1/2">
                      <img
                        src={trade.receiverbook.imageUrl}
                        alt={trade.receiverbook.title}
                        className="w-14 h-20 rounded-md object-cover shadow-sm"
                      />
                      <div>
                        <p className="font-medium leading-tight">
                          {trade.receiverbook.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {trade.receiverbook.author}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ===== Receiver + Status ===== */}
                  <div className="flex flex-col md:items-end w-full md:w-1/3 gap-2">
                    <div className="flex items-center gap-3 p-2 rounded-md bg-muted/40">
                      <img
                        src={trade.receiver.image}
                        alt={trade.receiver.displayName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {trade.receiver.displayName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {trade.receiver.email}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant={
                        trade.status === 'Requested' ? 'secondary' : 'default'
                      }
                      className="uppercase tracking-wide"
                    >
                      {trade.status}
                    </Badge>

                    <p className="text-xs text-muted-foreground">
                      Requested on{' '}
                      {format(new Date(trade.createdAt), 'MMMM do, yyyy')}
                    </p>

                    <Button
                      variant="outline"
                      disabled
                      className="mt-1 opacity-70 cursor-not-allowed"
                    >
                      Awaiting Receiver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestedTrades;

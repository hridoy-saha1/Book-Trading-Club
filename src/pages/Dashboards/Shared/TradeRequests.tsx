import UseAxiosSecure from '@/axios/UseAxiosSecure';
import { useAuth } from '@/firebase/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { CircleCheckBig, CircleX } from 'lucide-react';
import Swal from 'sweetalert2';

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

const TradeRequests = () => {
  // Handle Function
  const HandleRejectTrade = async (item: Trade) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject trade!',
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosSecure.put(
          `/api/trades/reject-trade/${item._id}`
        );

        console.log(response);

        await Swal.fire({
          title: 'Rejected!',
          text: 'Trade has been rejected successfully.',
          icon: 'success',
        });
        refetch();
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong while rejecting the trade.',
          icon: 'error',
        });
      }
    }
  };
  const HandleAcceptTrade = async (item: Trade) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Accept trade!',
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosSecure.put(
          `/api/trades/accept-trade/${item._id}`
        );

        console.log(response);

        await Swal.fire({
          title: 'Accepted!',
          text: 'Trade has been accepted successfully.',
          icon: 'success',
        });
        refetch();
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong while accepting the trade.',
          icon: 'error',
        });
      }
    }
  };

  /////////////////////////////////////////////////////////
  const { dbUser } = useAuth();
  const axiosSecure = UseAxiosSecure();

  const {
    data: traderequests,
    isLoading,
    refetch,
    isFetching,
  } = useQuery<TradeAPI>({
    queryKey: ['traderequests', dbUser?._id],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/api/trades/trade-requests/${dbUser?._id}`
      );
      return res.data;
    },
    enabled: !!dbUser?._id,
  });

  if (isLoading || isFetching) {
    return (
      <div className="p-6 grid gap-4">
        {[1, 2, 3].map((i) => (
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
            <div className="mt-4 flex justify-end">
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold mb-4">Trade Requests</h1>

      {traderequests?.data?.length === 0 && (
        <p className="text-muted-foreground text-center">
          No trade requests found.
        </p>
      )}

      <div className="grid gap-6">
        {traderequests?.data?.map((trade) => (
          <Card key={trade._id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <img
                  src={trade.sender.image}
                  alt={trade.sender.displayName}
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <div>
                  <p className="font-semibold">{trade.sender.displayName}</p>
                  <p className="text-sm text-muted-foreground">
                    {trade.sender.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Requested on {format(new Date(trade.createdAt), 'PPpp')}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="grid md:grid-cols-2 gap-4">
              {/* Sender's Book */}
              <div className="p-3 border rounded-xl flex flex-col md:flex-row gap-4">
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

              {/* Receiver's Book */}
              <div className="p-3 border rounded-xl flex flex-col md:flex-row gap-4">
                <img
                  src={trade.receiverbook.imageUrl}
                  alt={trade.receiverbook.title}
                  className="w-24 h-32 rounded-lg object-cover border"
                />
                <div>
                  <h3 className="font-semibold">{trade.receiverbook.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    by {trade.receiverbook.author}
                  </p>
                  <p className="text-sm mt-1">
                    Price: ${trade.receiverbook.price}
                  </p>
                  <p className="text-xs mt-1 text-muted-foreground">
                    Owned by You
                  </p>
                </div>
              </div>
            </CardContent>

            <div className="flex justify-end px-6 pb-4 gap-10">
              <Button
                onClick={() => {
                  HandleAcceptTrade(trade);
                }}
                variant="default"
                className="items-center"
              >
                <CircleCheckBig className="mt-1" />
                Accept Trade
              </Button>
              <Button
                onClick={() => {
                  HandleRejectTrade(trade);
                }}
                variant="outline"
                className="items-center"
              >
                <CircleX className="mt-1" />
                Reject Trade
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TradeRequests;

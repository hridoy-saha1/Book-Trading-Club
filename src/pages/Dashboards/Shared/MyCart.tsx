import UseAxiosSecure from '@/axios/UseAxiosSecure';
import { useAuth } from '@/firebase/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'react-toastify';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
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

const MyCart = () => {
  const axiosSecure = UseAxiosSecure();
  const { dbUser } = useAuth();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // const stripePromise = loadStripe('your-publishable-key-here');

  // Queriers Fetching
  const {
    data: cartitems,
    isPending,
    isLoading,
    refetch: GetCart,
    isFetching,
  } = useQuery<OrderAPI>({
    queryKey: ['myCart', dbUser?._id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/cart/${dbUser?._id}`);
      return res.data;
    },
  });

  //   Handle Functions
  const HandleDeleteCartItem = async (item: Order) => {
    setDeletingId(item._id);
    try {
      await axiosSecure.delete(`/api/cart/${item._id}`);
      GetCart();
      toast.success('Item Deleted Successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete item');
    } finally {
      setDeletingId(null);
    }
  };

  const HandleMovetoOrders = async (items: Order[]) => {
    const cartitems = items.map((item) => ({
      _id: item._id,
      user: dbUser?._id,
      book: item.book._id,
    }));
    console.log(cartitems);

    try {
      const response = await axiosSecure.post('/api/orders', { cartitems });
      console.log(response);
      GetCart();
      toast.success('You have successfully bought the books');
    } catch (error) {
      console.error(error);
      toast.error('Failed to move items to orders');
    }
  };

  // async function MakePayment(products: Order[]) {
  //   try {
  //     // 1. Call backend to create session
  //     const response = await fetch(
  //       'http://localhost:3000/create-checkout-session',
  //       {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ products }),
  //       }
  //     );

  //     if (!response.ok) {
  //       const errData = await response.json();
  //       console.error('Backend error creating session:', errData);
  //       toast.error('Failed to start checkout session');
  //       return;
  //     }

  //     const data = await response.json();

  //     // 2. Expect backend to return { url: session.url }
  //     const checkoutUrl = data.url;
  //     if (!checkoutUrl) {
  //       console.error('No checkout URL returned from backend:', data);
  //       toast.error('Checkout setup failed');
  //       return;
  //     }

  //     // 3. Redirect user to Stripe hosted checkout
  //     window.location.assign(checkoutUrl);
  //   } catch (err) {
  //     console.error('Payment error:', err);
  //     toast.error('Something went wrong during payment');
  //   }
  // }

  const HandleCheckout = async (items: Order[]) => {
    if (items.length === 0) return;

    try {
      // 1. Move items to orders first
      const cartItemsPayload = items.map((item) => ({
        _id: item._id,
        user: dbUser?._id,
        book: item.book._id,
      }));

      await axiosSecure.post('/api/orders', { cartitems: cartItemsPayload });
      GetCart(); // refresh cart
      toast.success('Items moved to your orders');

      // 2. Then create Stripe checkout session
      const response = await fetch(
        'https://book-trading-club-backend.vercel.app/create-checkout-session',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products: items }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        console.error('Backend error creating session:', errData);
        toast.error('Failed to start checkout session');
        return;
      }

      const data = await response.json();
      window.location.assign(data.url); // redirect to Stripe checkout
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong during checkout');
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-muted-foreground text-lg">
        Loading your cart...
      </div>
    );
  }

  const items = cartitems?.data ?? [];

  const subtotal = items.reduce((acc, item) => {
    const price = item.book.Exchange === 'Donate' ? 0 : item.book.price;
    return acc + price;
  }, 0);

  return (
    <div className="p-6 text-foreground grid lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-semibold flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-primary" />
            My Cart
          </h1>
          <p className="text-muted-foreground text-sm">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
            <ShoppingCart className="w-14 h-14 mb-4 opacity-50" />
            <p>Your cart is empty.</p>
          </div>
        ) : (
          items.map((item) => (
            <Card key={item._id} className="transition hover:shadow-md">
              <CardContent className="flex flex-col md:flex-row items-center justify-between p-4">
                {/* Image + Info */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <img
                    src={item.book.imageUrl}
                    alt={item.book.title}
                    className="w-24 h-32 object-cover rounded-md border"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{item.book.title}</h2>
                    <p className="text-muted-foreground text-sm">
                      {item.book.author}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Added on {format(new Date(item.createdAt), 'PPP')}
                    </p>

                    {/* Price or Donate */}
                    <div className="mt-2 flex items-center gap-2">
                      {item.book.Exchange === 'Donate' ? (
                        <>
                          <p className="line-through text-muted-foreground/70">
                            {item.book.price} ৳
                          </p>
                          <p className="text-green-500 font-semibold">0 ৳</p>
                          <span className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 text-xs px-2 py-0.5 rounded-md">
                            Donated
                          </span>
                        </>
                      ) : (
                        <p className="text-primary font-medium">
                          {item.book.price} ৳
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                {deletingId === item._id ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-500 mt-4 md:mt-0"
                  >
                    <Spinner />
                    Removing...
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive/80 mt-4 md:mt-0"
                    onClick={() => HandleDeleteCartItem(item)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
        {isFetching && (
          <div className="flex w-full max-w-xs mx-auto flex-col gap-4 [--radius:1rem]">
            <Item variant="muted" className="w-full">
              <ItemMedia>
                <Spinner />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="line-clamp-1">
                  Refreshing your Cart...
                </ItemTitle>
              </ItemContent>
            </Item>
          </div>
        )}
      </div>

      {/* Checkout Summary */}
      <Card className="h-fit">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Checkout Summary</h2>

          <div className="space-y-3 text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{subtotal} ৳</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery & Service</span>
              <span>0 ৳</span>
            </div>

            <Separator className="my-3" />

            <div className="flex justify-between font-semibold text-foreground">
              <span>Total</span>
              <span className="text-primary">{subtotal} ৳</span>
            </div>

            {items.some((i) => i.book.Exchange === 'Donate') && (
              <p className="text-green-500 text-sm mt-2">
                {items.filter((i) => i.book.Exchange === 'Donate').length}{' '}
                donated{' '}
                {items.filter((i) => i.book.Exchange === 'Donate').length > 1
                  ? 'items'
                  : 'item'}{' '}
                — price set to 0৳
              </p>
            )}
          </div>

          {items.length === 0 ? (
            <Button
              variant={'destructive'}
              className="w-full mt-6"
              onClick={() => {}}
            >
              Your Cart Is empty
            </Button>
          ) : subtotal == 0 ? (
            <Button
              className="w-full mt-6"
              onClick={() => {
                HandleMovetoOrders(items);
              }}
            >
              Get the Books
            </Button>
          ) : (
            <Button
              className="w-full mt-6"
              onClick={() => {
                HandleCheckout(items);
              }}
            >
              Proceed to Checkout
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full mt-3"
            onClick={() => navigate('/browse')}
          >
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyCart;

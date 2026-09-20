import { motion } from 'framer-motion';
import UseAxiosSecure from '@/axios/UseAxiosSecure';
import ShareModal from '@/components/Modals/ShareModal';
import Loader from '@/components/Loaders/Loader';
import { useFavorites } from '@/hooks/useFavorites';
import { useQuery } from '@tanstack/react-query';
import { Heart, MoveLeft } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import notify from '@/lib/notify';
import { useAuth } from '@/firebase/AuthProvider';
import { AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
// import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import { FaSpinner } from 'react-icons/fa';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';


// -------- Types --------
type ApiBook = {
  _id: string;
  title: string;
  author: string;
  ISBN?: string;
  Location?: string;
  Condition?: string;
  Exchange?: string;
  Language?: string;
  category: string;
  tags?: string[];
  price: number;
  description: string;
  imageUrl: string;
  uid: string;
};

type Review = {
  _id: string;
  userId: string;
  bookId: string;
  rating: number; // 1..5
  content: string;
  title: string;
  createdAt: string;
  user?: { displayName?: string };
};

type ReviewAPI = {
  error: boolean;
  message: string;
  data: Review[] | null;
};

export default function BookDetails() {
  const { dbUser } = useAuth();
  // console.log(dbUser);
  // const axiosSecure = UseAxiosSecure();
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [books, setBooks] = useState<ApiBook[]>([]);
  const [addingtocart, setaddingtocart] = useState<boolean>(false);

  const HandleAddReview = async () => {
    if (rating == 0 || review == '' || title == '') {
      return toast.error('All fields are required');
    }
    const ReviewPayload = {
      user: dbUser?._id,
      book: book?._id,
      rating: rating,
      title: title,
      content: review,
    };
    console.log(ReviewPayload);
    try {
      const res = await axiosSecure.post('/api/reviews', ReviewPayload);
      console.log(res);
      toast.success('Review Added Successfully');
      refetch();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || err.message;
      // toast.error(`Failed to add the review. ${errorMessage}`);
      console.log(errorMessage);
    }
  };

  const HandleAddToCart = async () => {
    const CartItemPayload = {
      user: dbUser?._id,
      book: book?._id,
    };
    console.log(CartItemPayload);
    setaddingtocart(true);
    try {
      const response = await axiosSecure.post(
        '/api/cart/add-to-cart',
        CartItemPayload
      );
      console.log(response);
      toast.success('Book Added To the Cart Successfully');
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || err.message;
      // toast.error(`Failed to add the Book to the Cart. ${errorMessage}`);
      console.log(errorMessage);
    } finally {
      setaddingtocart(false);
    }
  };

  const HandleTradeDialogTrigger = async (book: ApiBook) => {
    if (book.uid === dbUser?.uid) {
      return toast.error('You already own this book');
    }
    const res = await axiosSecure.get(
      `/api/books/get-books-by-location/${book.Location}`
    );
    const resbooks: any = res.data.data;
    const filteredbooks = resbooks.filter(
      (book: any) => book?.uid === dbUser?.uid
    );
    setBooks(filteredbooks);
    console.log(filteredbooks);
    setOpen(true);
  };
  const HandleTrade = async (selectedbook: ApiBook) => {
    // console.log('Selected Book For Trade: ', book);
    try {
      const res = await axiosSecure.get(`/api/users/${book?.uid}`);
      console.log(res.data);
      const payload = {
        sender: dbUser?._id,
        receiver: res?.data?._id,
        senderbook: selectedbook._id,
        receiverbook: book?._id,
      };
      console.log(payload);
      const res2 = await axiosSecure.post('/api/trades', payload);
      console.log(res2);
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
    }
  };

  const { toggleFavorite, isFavorite, isAuthenticated } = useFavorites();

  const { id } = useParams<{ id: string }>();
  const axiosSecure = UseAxiosSecure();

  // -------- Book details --------
  const {
    data: book,
    isLoading,
    isFetching,
    isError,
  } = useQuery<ApiBook>({
    queryKey: ['book', id],
    queryFn: async () => {
      const res = await axiosSecure.get<ApiBook>(`/api/books/${id}`);
      return res.data;
    },
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });

  // -------- Reviews --------
  const {
    data: reviewsResp,
    isLoading: isReviewsLoading,
    isFetching: ReviewsFetching,
    isError: isReviewsError,
    refetch,
  } = useQuery<ReviewAPI>({
    queryKey: ['book-reviews', book?._id],
    queryFn: async () => {
      const res = await axiosSecure.get<ReviewAPI>(
        `/api/reviews/get-book-reviews/${book!._id}`
      );
      return res.data;
    },
    enabled: !!book?._id,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const reviews: Review[] = reviewsResp?.data ?? [];

  // -------- Ratings math --------
  const { avgRating, totalReviews, distribution } = useMemo(() => {
    const total = reviews.length;
    if (!total) {
      return {
        avgRating: 0,
        totalReviews: 0,
        distribution: [5, 4, 3, 2, 1].map((s) => ({
          stars: s,
          count: 0,
          pct: 0,
        })),
      };
    }
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    const avg = sum / total;

    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of reviews) counts[r.rating] = (counts[r.rating] || 0) + 1;

    const dist = [5, 4, 3, 2, 1].map((s) => ({
      stars: s,
      count: counts[s] || 0,
      pct: Math.round(((counts[s] || 0) / total) * 100),
    }));

    return {
      avgRating: Number(avg.toFixed(1)),
      totalReviews: total,
      distribution: dist,
    };
  }, [reviews]);

  // stars renderer (clean, no icons)
  const renderStars = (value: number) => {
    const rounded = Math.round(value);
    return (
      <span className="text-yellow-500">
        {'★'.repeat(rounded)}
        <span className="text-gray-300">
          {'★'.repeat(Math.max(0, 5 - rounded))}
        </span>
      </span>
    );
  };

  const handleWishlistClick = async () => {
    if (!isAuthenticated) {
      notify.error('Please log in to add books to favorites');
      return;
    }
    const bookId = book?._id;
    if (!bookId) {
      notify.error('Book ID is not available');
      return;
    }
    const wasFavorite = isFavorite(bookId);
    const ok = await toggleFavorite(bookId);
    if (!ok) return notify.error('Failed to update favorites');
    const bookTitle = book?.title || 'Unknown Book';
    notify.success(
      wasFavorite
        ? `"${bookTitle}" removed from favorites`
        : `"${bookTitle}" added to favorites`
    );
  };

  const currentBookId = book?._id;
  const showLoading =
    isLoading || (isFetching && book && String(currentBookId) !== String(id));

  if (showLoading || isReviewsLoading) return <Loader />;

  if (isError)
    return <div className="p-6">❌ Failed to load book details.</div>;
  if (!book) return <div className="p-6">❌ Book not found.</div>;

  const shareBook =
    currentBookId != null
      ? { id: String(currentBookId), title: book.title, author: book.author }
      : null;

  return (
    <motion.section
      className="p-6 max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <Link
        to="/browse"
        className="text-black text-sm flex gap-2 items-center rounded-full px-4 border border-black/70 transition-all duration-200 hover:bg-gray-700 hover:text-white w-[11rem] py-2"
      >
        <MoveLeft className="pt-[2px]" />
        Back to Browse
      </Link>

      <motion.div
        className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-start"
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 70 }}
      >
        {/* Image */}
        <div className="w-full">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-auto lg:h-[820px] rounded-2xl shadow-xl object-cover ring-1 ring-black/5"
          />
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <h1 className="text-3xl md:text-4xl font-extrabold text-soil-900 tracking-tight">
            {book.title}
          </h1>
          <p className="text-lg text-sand-700">by {book.author}</p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {book.Location && (
              <p>
                <strong>Location:</strong> {book.Location}
              </p>
            )}
            {book.Condition && (
              <p>
                <strong>Condition:</strong> {book.Condition}
              </p>
            )}
            {book.Exchange && (
              <p>
                <strong>Exchange:</strong> {book.Exchange}
              </p>
            )}
            {book.Language && (
              <p>
                <strong>Language:</strong> {book.Language}
              </p>
            )}
            {book.category && (
              <p className="col-span-2">
                <strong>Genre:</strong> {book.category}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {(book.tags ?? []).map((t) => (
              <span
                key={t}
                className="text-xs rounded-full bg-[#faf8f4] px-3 py-1 text-sand-700 border border-sand-300"
              >
                #{t}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2">
            {!addingtocart && book.Exchange !== 'Swap' && (
              <button
                onClick={HandleAddToCart}
                className="px-5 py-2.5 bg-leaf-500 hover:bg-leaf-600 text-white rounded-xl shadow transition"
              >
                Add to Cart
              </button>
            )}
            {!addingtocart && book.Exchange === 'Swap' && (
              <div>
                <button
                  onClick={() => {
                    HandleTradeDialogTrigger(book);
                  }}
                  className="px-5 py-2.5 bg-leaf-500 hover:bg-leaf-600 text-white rounded-xl shadow transition"
                >
                  Trade Now
                </button>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogContent className="sm:max-w-[650px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">
                        Available Books for Trade
                      </DialogTitle>
                      <DialogDescription>
                        Choose one of your books below to propose a trade.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 space-y-4">
                      {books.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          You don't have any books available for trade at this
                          location.
                        </p>
                      ) : (
                        <div className="overflow-x-auto rounded-md border border-border">
                          <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-left">
                              <tr>
                                <th className="p-3 font-medium">Image</th>
                                <th className="p-3 font-medium">Title</th>
                                <th className="p-3 font-medium">Author</th>
                                <th className="p-3 font-medium text-center">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {books.map((b) => (
                                <tr
                                  key={b._id}
                                  className="border-t border-border hover:bg-muted/40 transition-colors"
                                >
                                  <td className="p-3">
                                    <img
                                      src={b.imageUrl}
                                      alt={b.title}
                                      className="w-14 h-20 object-cover rounded-md shadow-sm"
                                    />
                                  </td>
                                  <td className="p-3 font-semibold">
                                    {b.title}
                                  </td>
                                  <td className="p-3 text-muted-foreground">
                                    {b.author}
                                  </td>
                                  <td className="p-3 text-center">
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={() => {
                                        HandleTrade(b);
                                      }}
                                      className="rounded-md"
                                    >
                                      Trade Now
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    <DialogFooter className="mt-4">
                      <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            {addingtocart && book.Exchange !== 'Swap' && (
              <button
                disabled
                className="px-5 py-2.5 bg-gray-400 text-white flex gap-2 items-center rounded-xl shadow-sm 
               opacity-60 cursor-not-allowed select-none transition"
              >
                Adding Book to Cart
                <FaSpinner className="animate-spin" />
              </button>
            )}
            {addingtocart && book.Exchange === 'Swap' && (
              <button
                disabled
                className="px-5 py-2.5 bg-gray-400 text-white flex gap-2 items-center rounded-xl shadow-sm 
               opacity-60 cursor-not-allowed select-none transition"
              >
                Trading...
                <FaSpinner className="animate-spin" />
              </button>
            )}

            {isFavorite(book?._id) ? (
              <motion.button
                onClick={handleWishlistClick}
                className="flex items-center gap-2 px-5 py-2.5 hover:bg-leaf-600 hover:text-white text-gray-600 font-semibold bg-[#faf8f4] border border-gray-300 rounded-xl shadow transition"
                whileHover={{ scale: 1.05 }}
              >
                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                Remove from Wishlist
              </motion.button>
            ) : (
              <motion.button
                onClick={handleWishlistClick}
                className="flex items-center gap-2 px-5 py-2.5 hover:bg-leaf-600 hover:text-white text-gray-600 font-semibold bg-[#faf8f4] border border-gray-300 rounded-xl shadow transition"
                whileHover={{ scale: 1.05 }}
              >
                <Heart className="w-5 h-5 text-gray-400" />
                Add to wishlist
              </motion.button>
            )}

            {shareBook && <ShareModal book={shareBook} />}
          </div>

          {/* Rate & Review Section */}
          <div className="mt-6 p-5 border border-sand-200 rounded-2xl bg-sand-50 shadow-sm">
            {/* Title */}
            <h1 className="text-xl font-bold text-gray-800 mb-4">
              Share Your Experience
            </h1>

            {/* Rating Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl transition ${
                      rating >= star ? 'text-yellow-400' : 'text-gray-300'
                    } hover:scale-110`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Review Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <input
                type="text"
                placeholder="Review Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-20 p-3 border border-sand-300 rounded-md text-lg font-bold focus:outline-none focus:ring-2 focus:ring-leaf-500/50 bg-white my-4"
              />
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                required
                placeholder="Write your honest feedback..."
                className="w-full h-28 p-3 border border-sand-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-leaf-500/50 bg-white"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={HandleAddReview}
              className="mt-4 w-full sm:w-auto px-6 py-2.5 bg-leaf-500 text-white font-medium rounded-xl hover:bg-leaf-600 transition"
            >
              Submit Review
            </button>
          </div>
        </div>
      </motion.div>

      {/* -------- Reviews list -------- */}
      <Separator className="mt-20 bg-black" />
      <div className="my-16">
        <h2 className="text-3xl font-extrabold font-mono text-center mb-8">
          What readers are saying
        </h2>

        {/* ================ CUSTOMER REVIEWS SUMMARY ================ */}
        <div className="rounded-2xl border border-sand-200 bg-white/70 backdrop-blur-sm shadow-sm p-5 my-5">
          <h3 className="text-xl font-semibold text-soil-900 mb-3 text-center md:text-left">
            Customer reviews
          </h3>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Average + stars */}
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="text-4xl font-extrabold">
                {avgRating.toFixed(1)}
              </div>
              <div className="text-2xl leading-none">
                {renderStars(avgRating)}
              </div>
              <div className="text-sm text-sand-600">
                <span className="font-medium">{avgRating.toFixed(1)}</span> out
                of 5
                <div className="text-xs">
                  {totalReviews} customer rating
                  {totalReviews === 1 ? '' : 's'}
                </div>
              </div>
            </div>

            {/* Distribution 5→1 */}
            <div className="w-full md:max-w-md space-y-2.5">
              {distribution.map(({ stars, pct }) => (
                <div key={stars} className="flex items-center gap-3">
                  <button
                    type="button"
                    className="w-12 text-left text-sm text-sand-700 hover:underline"
                  >
                    {stars} star
                  </button>
                  <div className="relative flex-1 h-3 rounded-full bg-sand-100 overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: `${pct}%`,
                        background:
                          'linear-gradient(90deg, #fde68a 0%, #facc15 40%, #eab308 100%)',
                      }}
                    />
                    {/* small knob like the screenshot */}
                    <div
                      className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white shadow ring-1 ring-black/10"
                      style={{ right: `calc(${100 - pct}% - 4px)` }}
                    />
                  </div>
                  <div className="w-16 text-right text-sm text-sand-700">
                    {pct}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 text-xs text-center md:text-left text-sand-500 underline underline-offset-2 cursor-pointer">
            How do we calculate ratings?
          </div>
        </div>
        {/* ============== END SUMMARY ============== */}

        {isReviewsError && (
          <p className="text-center text-red-500">Failed to load reviews.</p>
        )}

        {!isReviewsError && totalReviews === 0 && (
          <p className="text-center text-sand-600">
            No reviews yet. Be the first!
          </p>
        )}

        {reviews.length > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((r) => (
              <li
                key={r._id}
                className="rounded-2xl bg-white/80 backdrop-blur-sm border border-sand-200 shadow-sm p-5 hover:shadow-md transition"
              >
                <div className="text-sand-700 text-[13px] mb-2 flex items-center justify-between">
                  <div>
                    <strong className="text-soil-900">
                      {r.user?.displayName || 'Anonymous'}
                    </strong>
                    <span className="ml-2 text-sand-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-yellow-500 text-sm">
                    {'★'.repeat(r.rating)}
                    <span className="text-gray-300">
                      {'★'.repeat(Math.max(0, 5 - r.rating))}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-1">{r.title}</h3>
                <p className="text-sand-800 text-sm leading-6">{r.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/*  ------- Fetching Loader ------*/}
      {ReviewsFetching && (
        <Button className="flex justify-center mx-auto" disabled size="sm">
          {/* <Spinner /> */}
          Refreshing...
        </Button>
      )}
    </motion.section>
  );
}

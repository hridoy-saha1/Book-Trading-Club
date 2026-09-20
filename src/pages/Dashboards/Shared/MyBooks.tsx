import { useQuery } from '@tanstack/react-query';
import UseAxiosSecure from '@/axios/UseAxiosSecure';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  MoreHorizontal,
  Pen,
  SquareArrowOutUpRight,
  Trash2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { useAuth } from '@/firebase/AuthProvider';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import UpdateBookModal from '../User/UpdateBookModal';

const MyBooks = () => {
  const axiosSecure = UseAxiosSecure();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    data: books = [],
    isPending,
    refetch: GetBooks,
  } = useQuery({
    queryKey: ['userbooks'],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/api/books/get-user-books/${user?.uid}`
      );
      return res.data;
    },
  });

  const handleDelete = async (book: any) => {
    const response = await axiosSecure.delete(`/api/books/${book._id}`);
    console.log(response);
    toast.success('Book Deleted Successfully');
    GetBooks();
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  console.log(user);
  return (
    <div>
      <h1 className="mb-5">This is the My Books Page</h1>

      {/* Table */}
      <div className="overflow-hidden rounded-md border mb-20">
        <Table>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Author</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Amount</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book: any) => (
              <TableRow className="text-center" key={book._id}>
                <TableCell className="flex flex-col items-center justify-center gap-3 mt-4">
                  <img
                    src={book.imageUrl}
                    width={90}
                    height={90}
                    className="object-cover"
                    alt=""
                  />
                  {book.title}
                </TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.category}</TableCell>
                <TableCell>{book.price} BDT</TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="my-2 border-none outline-none"
                      >
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        asChild
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Button
                          variant="ghost"
                          className="h-8 px-2 gap-2"
                          onClick={() => handleDelete(book)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Book
                        </Button>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        asChild
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Dialog open={open} onOpenChange={setOpen}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" className="h-8 px-2 gap-2">
                              <Pen className="w-4 h-4" />
                              Update Book
                            </Button>
                          </DialogTrigger>

                          {/* Your modal. Spaces will now type fine inside inputs. */}
                          <UpdateBookModal
                            bookdata={book}
                            GetBooks={GetBooks}
                            setOpen={setOpen}
                          />
                        </Dialog>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        asChild
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Button
                          variant="ghost"
                          className="h-8 px-2 gap-2"
                          onClick={() => navigate(`/book/${book._id}`)}
                        >
                          <SquareArrowOutUpRight className="w-4 h-4" />
                          View Details
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MyBooks;

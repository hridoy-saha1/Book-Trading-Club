import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import UseAxiosSecure from '@/axios/UseAxiosSecure';
import { X } from 'lucide-react';

const UpdateBookModal = ({
  bookdata,
  GetBooks,
  setOpen,
}: {
  bookdata: any;
  GetBooks: any;
  setOpen: any;
}) => {
  const axiosSecure = UseAxiosSecure();

  // Initial state set with bookdata
  const [title, setTitle] = useState(bookdata?.title || '');
  const [author, setAuthor] = useState(bookdata?.author || '');
  const [ISBN, setISBN] = useState(bookdata?.ISBN || '');
  const [category, setCategory] = useState(bookdata?.category || '');
  const [price, setPrice] = useState(bookdata?.price || '');
  const [description, setDescription] = useState(bookdata?.description || '');

  const [Location, setLocation] = useState(bookdata?.Location || 'Dhaka');
  const [Condition, setCondition] = useState(bookdata?.Condition || 'Good');
  const [Exchange, setExchange] = useState(bookdata?.Exchange || 'Swap');
  const [Language, setLanguage] = useState(bookdata?.Language || 'English');
  const [tags, setTags] = useState(bookdata?.tags || []);

  const handleTagInput = (val: string) => {
    const parts = val
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    setTags(parts);
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag : any) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate fields before submission
    if (!title || !author || !category || !description) {
      toast.error('Please fill all required fields.');
      return;
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      toast.error('Price must be a valid non-negative number.');
      return;
    }

    try {
      const updatedBook = {
        _id: bookdata._id,
        title,
        author,
        ISBN,
        Location,
        Condition,
        Exchange,
        Language,
        category,
        tags,
        price: numericPrice,
        description,
      };

      const response = await axiosSecure.put(
        `/api/books/${bookdata._id}`,
        updatedBook
      );
      console.log(response);
      toast.success('Book updated successfully!');
      GetBooks();
      setOpen(false);
    } catch (err) {
      console.error('❌ Error updating book:', err);
      toast.error('Failed to update book. Please try again.');
    }
  };

  return (
    <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold">Edit Book</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          Update your book details below. All fields marked with * are required.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        {/* Title and Author */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
              className="h-10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author" className="text-sm font-medium">
              Author <span className="text-red-500">*</span>
            </Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
              className="h-10"
              required
            />
          </div>
        </div>

        {/* ISBN and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="isbn" className="text-sm font-medium">
              ISBN
            </Label>
            <Input
              id="isbn"
              value={ISBN}
              onChange={(e) => setISBN(e.target.value)}
              placeholder="9780061122415"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category <span className="text-red-500">*</span>
            </Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 border border-input bg-background rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="">Select category</option>
              {['fiction', 'non-fiction', 'education', 'comics'].map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-medium">
            Price (BDT) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            type="number"
            min="0"
            step="0.01"
            className="h-10"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description <span className="text-red-500">*</span>
          </Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-[100px] border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            placeholder="Write a detailed description about the book..."
            required
          />
        </div>

        {/* Location and Condition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Location
            </Label>
            <select
              id="location"
              value={Location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-10 border border-input bg-background rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {['Dhaka', 'Chattogram', 'Khulna', 'Rajshahi', 'Sylhet'].map(
                (l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition" className="text-sm font-medium">
              Condition
            </Label>
            <select
              id="condition"
              value={Condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full h-10 border border-input bg-background rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {['New', 'Like New', 'Good', 'Fair', 'Poor'].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exchange and Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="exchange" className="text-sm font-medium">
              Exchange Type
            </Label>
            <select
              id="exchange"
              value={Exchange}
              onChange={(e) => setExchange(e.target.value)}
              className="w-full h-10 border border-input bg-background rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {['Swap', 'Sell', 'Donate'].map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language" className="text-sm font-medium">
              Language
            </Label>
            <select
              id="language"
              value={Language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full h-10 border border-input bg-background rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {['English', 'Bangla', 'Hindi', 'Arabic', 'Chinese'].map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags" className="text-sm font-medium">
            Tags
          </Label>
          <Input
            id="tags"
            type="text"
            value={tags.join(', ')}
            onChange={(e) => handleTagInput(e.target.value)}
            placeholder="inspirational, journey, adventure"
            className="h-10"
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((t : any) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" className="w-full sm:w-auto">
            Save Changes
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default UpdateBookModal;

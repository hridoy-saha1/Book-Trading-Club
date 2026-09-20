import UseAxiosSecure from '@/axios/UseAxiosSecure';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/firebase/AuthProvider';
import { useState } from 'react';
import { toast } from 'react-toastify';

// ✅ Define props interface
interface EditUserProps {
  setOpen: (open: boolean) => void;
}

const EditUser = ({ setOpen }: EditUserProps) => {
  const { dbUser } = useAuth();
  const axiosSecure = UseAxiosSecure();
  const [name, setName] = useState(dbUser?.displayName || '');
  const [image, setImage] = useState(dbUser?.image || '');
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    if (!dbUser?.uid) return;

    const body = {
      displayName: name,
      image: image,
    };

    setUpdating(true);
    try {
      const response = await axiosSecure.put(`/api/users/${dbUser.uid}`, body);
      console.log(response);
      toast.success('User info updated successfully');
      setOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user info');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Edit Profile</SheetTitle>
        <SheetDescription>
          Make changes to your profile here. Click save when you&apos;re done.
        </SheetDescription>
      </SheetHeader>

      <div className="grid flex-1 auto-rows-min gap-6 my-5">
        <div className="grid gap-3">
          <Label htmlFor="edit-name">Name</Label>
          <Input
            id="edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="edit-image">Image URL</Label>
          <Input
            id="edit-image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="edit-email">Email</Label>
          <Input disabled id="edit-email" value={dbUser?.email || ''} />
        </div>
      </div>

      <SheetFooter>
        {!updating ? (
          <Button onClick={handleUpdate}>Save changes</Button>
        ) : (
          <Button disabled>
            <Spinner /> Updating...
          </Button>
        )}
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
};

export default EditUser;

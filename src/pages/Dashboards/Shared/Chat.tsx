import { useState, useRef, useEffect } from 'react';
import UseAxiosSecure from '@/axios/UseAxiosSecure';
import { useAuth } from '@/firebase/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { Image, Send, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'react-toastify';

const Chat = () => {
  const { id } = useParams();
  const { dbUser } = useAuth();
  const axiosSecure = UseAxiosSecure();
  const [textMessage, setTextMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // ✅ Fetch messages
  const {
    data: messagesResponse,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['messages', id, dbUser?._id],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/api/messages/get-messages/${id}/${dbUser?._id}`
      );
      return res.data;
    },
    enabled: !!dbUser?._id && !!id,
  });

  const messages = messagesResponse?.data || [];

  // ✅ Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ✅ Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // ✅ Handle Send
  const handleSend = async () => {
    const payload = {
      senderId: dbUser?._id,
      receiverId: id,
      text: textMessage,
      image: imagePreview,
    };
    try {
      await axiosSecure.post('/api/messages', payload);
      toast.success('Message Sent Successfully');
      refetch();
    } catch (error) {
      console.log(error);
    } finally {
      setTextMessage('');
      setImageFile(null);
      setImagePreview(null);
    }
  };

  // ✅ Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ Skeleton while loading
  if (isLoading || isFetching) {
    return (
      <div className="flex flex-col justify-between h-full bg-background rounded-lg">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'flex gap-2',
                i % 2 === 0 ? 'justify-start' : 'justify-end'
              )}
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-48 rounded-md" />
                <Skeleton className="h-4 w-32 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-lg transition-colors">
      {/* ====== Chat Messages ====== */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
        {messages.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground mt-10">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg: any) => {
            const isSender = msg.senderId === dbUser?._id;
            return (
              <div
                key={msg._id}
                className={cn(
                  'flex w-full',
                  isSender ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[70%] px-4 py-2 rounded-2xl shadow-sm text-sm',
                    isSender
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted text-foreground rounded-bl-none'
                  )}
                >
                  {msg.text && <p className="break-words">{msg.text}</p>}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="attachment"
                      className="mt-2 rounded-lg max-h-56 object-cover border border-border"
                    />
                  )}
                  <p className="text-[10px] text-muted-foreground text-right mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ====== Chat Input Area ====== */}
      <div className="px-3 pb-16 mt-4 border-t border-border flex flex-col gap-2 bg-muted/30 backdrop-blur-md">
        {/* Image Preview Section */}
        {imagePreview && (
          <div className="relative w-fit mx-1">
            <img
              src={imagePreview}
              alt="preview"
              className="max-h-24 rounded-lg object-cover border border-border shadow-md"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -left-2 bg-background text-foreground border border-border p-1 rounded-full shadow-sm hover:bg-destructive hover:text-destructive-foreground transition"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Input Row */}
        <div className="flex items-center gap-3 bg-background/60 backdrop-blur-md border border-border rounded-lg px-3 py-2 shadow-sm">
          {/* Image Upload */}
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex items-center justify-center p-2 rounded-full hover:bg-muted transition"
          >
            <Image className="size-5 text-muted-foreground" />
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Text Input */}
          <input
            type="text"
            placeholder="Type your message..."
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0"
          />

          {/* Send Button */}
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!textMessage && !imageFile}
            className="flex items-center gap-1"
          >
            <Send className="size-4" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

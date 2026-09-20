import { MessageSquare } from 'lucide-react';

const NoChatSelected = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-background text-foreground transition-colors">
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 rounded-full bg-muted/50 text-muted-foreground">
          <MessageSquare size={48} strokeWidth={1.5} />
        </div>

        <div>
          <h2 className="text-lg font-semibold">No Chat Selected</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Select a conversation from the list to start chatting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;

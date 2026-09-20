import React, { useState } from "react";
import { FaShareSquare } from 'react-icons/fa';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  EmailIcon,
} from "react-share";
import {  FiX, FiCopy } from "react-icons/fi";

interface Book {
  id: string;
  title: string;
  author: string;
}

interface Props {
  book: Book;
}

const ShareModal: React.FC<Props> = ({ book }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.href;
  const title = `Check out this book: ${book.title} by ${book.author}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Share Button */}
      <button
        onClick={() => setIsOpen(true)}
        
      >
       
        <FaShareSquare className="text-2xl" />
       
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-80 p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-lg font-semibold text-center mb-4">
              Share this book
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <FacebookShareButton url={"www.facebook.com"} >
                <FacebookIcon size={40} round />
              </FacebookShareButton>

              <TwitterShareButton url={"www.x.com"} title={title}>
                <TwitterIcon size={40} round />
              </TwitterShareButton>

              <WhatsappShareButton url={"www.whatsapp.com"} title={title}>
                <WhatsappIcon size={40} round />
              </WhatsappShareButton>

              <LinkedinShareButton url={"www.linkedin.com"} title={title}>
                <LinkedinIcon size={40} round />
              </LinkedinShareButton>

              <EmailShareButton url={"www.email.com"} subject={title} body="Check this out!">
                <EmailIcon size={40} round />
              </EmailShareButton>

             
            </div>

            {/* Copy link */}
            <div className="mt-6 flex items-center gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 rounded border px-2 py-1 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300"
              >
                <FiCopy />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareModal;

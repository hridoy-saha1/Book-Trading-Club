// src/components/Forms/Input.tsx
import React, { type ChangeEvent } from 'react';

type FileInputProps = {
  label?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  fileName?: string; // show selected file name
  onSelect: (file: File | null) => void; // bubble selection to parent
};

const FileInput: React.FC<FileInputProps> = ({
  label = 'Cover Image',
  accept = 'image/*',
  multiple = false,
  disabled = false,
  fileName,
  onSelect,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    onSelect(f);
  };

  return (
    <div className="w-full">
      <label className="block text-gray-700 font-medium mb-1">{label}</label>

      <div className="relative h-48 rounded-lg border-2 border-blue-500 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow">
        {/* Overlay text/icon */}
        <div className="absolute flex flex-col items-center pointer-events-none px-3 text-center">
          <img
            alt="File"
            className="mb-3"
            src="https://img.icons8.com/dusk/64/000000/file.png"
          />
          <span className="block text-gray-500 font-semibold">
            Drag &amp; drop your files here
          </span>
          <span className="block text-gray-400 mt-1">or click to upload</span>

          {fileName && (
            <span className="mt-3 inline-block max-w-[18rem] truncate rounded-md bg-white/80 px-2 py-1 text-sm text-gray-700 shadow">
              {fileName}
            </span>
          )}
        </div>

        {/* The actual input covering the whole box */}
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
};

export default FileInput;

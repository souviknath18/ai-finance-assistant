"use client";

import {
  Camera,
  Trash2,
  User,
} from "lucide-react";

import {
  ChangeEvent,
  useRef,
  useState,
} from "react";

export default function ProfileAvatar() {
  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const [image, setImage] =
    useState<string | null>(null);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      return;
    }

    const imageUrl =
      URL.createObjectURL(file);

    setImage(imageUrl);
  };

  const handleRemove = () => {
    setImage(null);

    if (
      fileInputRef.current
    ) {
      fileInputRef.current.value =
        "";
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[#dfe9fb] bg-[#f3f6fc] text-[#7c839b]">
            {image ? (
              <img
                src={image}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={30} />
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-black text-white shadow-[0_4px_12px_rgba(15,23,42,0.18)] transition hover:opacity-90"
            aria-label="Change profile picture"
          >
            <Camera size={14} />
          </button>
        </div>

        {/* Information */}
        <div className="min-w-0">
          <h3 className="text-[14px] font-bold text-black">
            Profile Picture
          </h3>

          <p className="mt-1 max-w-md text-[11px] leading-5 text-[#565e74]">
            Upload a clear profile
            photo. JPG, PNG, or WebP
            works best.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            fileInputRef.current?.click()
          }
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-[#dfe9fb] bg-white px-4 text-[11px] font-bold text-black transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
        >
          <Camera size={14} />

          {image
            ? "Change Photo"
            : "Upload Photo"}
        </button>

        {image && (
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-4 text-[11px] font-bold text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={14} />

            Remove
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={
          handleFileChange
        }
        className="hidden"
      />
    </div>
  );
}
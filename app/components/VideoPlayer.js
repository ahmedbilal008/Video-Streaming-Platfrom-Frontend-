'use client';

export default function VideoPlayer({ src }) {
  return (
    <div className="flex items-center justify-center rounded-xl w-full max-h-[90vh] bg-black p-2">
      <div className="w-full ">
        <video
          className="w-full max-h-[80vh] h-auto"
          src={src}
          controls
          playsInline
          autoPlay
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

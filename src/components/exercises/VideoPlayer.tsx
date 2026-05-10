'use client';

interface VideoPlayerProps {
  url: string;
}

export default function VideoPlayer({ url }: VideoPlayerProps) {
  const getYouTubeId = (url: string): string | null => {
    const regex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const youtubeId = getYouTubeId(url);

  if (youtubeId) {
    return (
      <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden mb-4">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Para Cloudinary u otros servidores
  return (
    <div className="w-full rounded-lg overflow-hidden mb-4">
      <video
        controls
        className="w-full bg-black"
        src={url}
      />
    </div>
  );
}
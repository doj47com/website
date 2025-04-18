import { useEffect, useState, useRef } from "react";
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

type Props = {
  playlist: string;
  thumbnail: string;
};

export default function Video(props: Props) {
  const { playlist, thumbnail } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const video = containerRef.current?.querySelector("video");
      if (!video) return;

      const player = videojs(video, {
        controls: true,
        autoplay: false,
        preload: "auto",
        fluid: true,
        poster: thumbnail,
        sources: [
          {
            src: playlist,
            type: "application/x-mpegURL",
          },
        ],
      });

      setPlayerReady(true);
      return () => player.dispose();
    }, 0); // defer to next tick to ensure it's mounted

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <video className="video-js vjs-default-skin w-full aspect-video" />
      {!playerReady && <p className="text-sm text-gray-500 mt-2">Loading player…</p>}
    </div>
  );
}

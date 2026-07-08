import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

function getYoutubeEmbedUrl(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`;
  }
  return null;
}

export default function ReelModal({ videos, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!videos?.length) return null;

  const youtubeEmbedUrl = getYoutubeEmbedUrl(videos[0]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button — fixed position, outside flex flow */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 text-white/70 hover:text-white transition-colors cursor-pointer z-[60]"
      >
        <span className="material-symbols-outlined text-3xl">close</span>
      </button>

      {/* Reel container */}
      <div
        className="w-full max-w-[380px] aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {youtubeEmbedUrl ? (
          <iframe
            src={youtubeEmbedUrl}
            title="Video Reel"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full object-cover border-0"
          />
        ) : (
          <video
            src={videos[0]}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </motion.div>,
    document.body
  );
}

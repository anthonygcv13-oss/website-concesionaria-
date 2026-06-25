import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReelModal from './ReelModal';

export default function TestimonialCard({ item, navigate }) {
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [email, setEmail] = useState('');
  const [input, setInput] = useState('');
  const [reelOpen, setReelOpen] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function addComment() {
    if (emailRegex.test(email) && input.trim()) {
      setComments(prev => [...prev, { id: Date.now(), email, text: input.trim() }]);
      setInput('');
    }
  }

  function isValid() {
    return emailRegex.test(email) && input.trim().length > 0;
  }

  function removeComment(id) {
    setComments(prev => prev.filter(c => c.id !== id));
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      className="min-w-[290px] sm:min-w-[340px] md:min-w-[380px] max-w-[400px] flex-shrink-0 snap-start bg-[#121212] border border-outline-variant/10 rounded-lg p-6 flex flex-col justify-between hover:border-secondary hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300 group"
    >
      <div>
        {/* Image & Badge */}
        <div className="relative h-[220px] w-full overflow-hidden rounded-md mb-6">
          <img
            alt={item.vehicleName}
            src={item.image}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-3 left-3 bg-[#775a19]/90 border border-secondary-fixed/30 text-secondary-fixed font-label-md text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-DEFAULT">
            {item.badge}
          </span>
        </div>

        {/* Title & Rating */}
        <div className="mb-2">
          <h3 className="font-headline-lg text-xl text-white font-bold group-hover:text-secondary transition-colors">
            {item.vehicleName}
          </h3>
          <div className="flex items-center gap-0.5 mt-1 text-secondary-fixed">
            {[...Array(item.rating)].map((_, i) => (
              <span
                key={i}
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            ))}
          </div>
        </div>

        {/* User Comments List + Input */}
        <div className="my-6 space-y-3">
          {comments.map(c => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary/10 border border-secondary/20 rounded-md p-3 group/comment"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-secondary font-label-md uppercase tracking-wider block mb-0.5">{c.email}</span>
                  <p className="text-sm text-white leading-relaxed whitespace-pre-wrap break-words">{c.text}</p>
                </div>
                <button
                  onClick={() => removeComment(c.id)}
                  className="flex-shrink-0 text-outline-variant/40 hover:text-red-400 transition-colors cursor-pointer p-0.5 opacity-0 group-hover/comment:opacity-100"
                  title="Eliminar comentario"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
            </motion.div>
          ))}

          {comments.length === 0 && (
            <p className="text-[11px] text-outline-variant/50 italic">Aún no hay comentarios. Añade el tuyo abajo.</p>
          )}

          <div className="pt-2 space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo electrónico"
              className="w-full bg-white/5 border border-outline-variant/20 rounded-md p-2.5 text-sm text-white placeholder-outline-variant/50 focus:outline-none focus:border-secondary transition-colors"
            />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  addComment();
                }
              }}
              placeholder="Escribe tu comentario..."
              className="w-full bg-white/5 border border-outline-variant/20 rounded-md p-3 text-sm text-white placeholder-outline-variant/50 resize-none focus:outline-none focus:border-secondary transition-colors"
              rows={2}
            />
            <div className="flex items-center justify-end">
              <button
                onClick={addComment}
                disabled={!isValid()}
                className={`text-xs font-label-md px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  isValid()
                    ? 'bg-secondary text-on-secondary hover:opacity-90'
                    : 'bg-outline-variant/10 text-outline-variant/40 cursor-not-allowed'
                }`}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Actions: Reel + Like */}
      <div className="flex justify-end items-center mt-4 pt-4 border-t border-outline-variant/10">
        {/* Reel Button */}
        {item.reelVideos?.length > 0 && (
          <button
            onClick={() => setReelOpen(true)}
            className="mr-auto flex items-center gap-2 border border-outline-variant/30 text-outline-variant hover:border-[#25D366] hover:text-[#25D366] px-4 py-2.5 rounded transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">smart_display</span>
            <span className="text-xs font-label-md font-bold">Reel</span>
          </button>
        )}

        {/* Like Button */}
        <button
          className={`border px-4 py-2.5 rounded flex items-center gap-2 transition-colors cursor-pointer ${
            liked
              ? 'border-red-500 text-red-500 bg-red-500/5'
              : 'border-outline-variant/30 text-outline-variant hover:border-secondary hover:text-secondary'
          }`}
          onClick={() => setLiked(!liked)}
        >
          <span
            className="material-symbols-outlined text-lg"
            style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
          <span className="text-xs font-label-md font-bold">
            {liked ? item.initialLikes + 1 : item.initialLikes}
          </span>
        </button>
      </div>

      {/* Reel Modal */}
      <AnimatePresence>
        {reelOpen && (
          <ReelModal
            videos={item.reelVideos || []}
            onClose={() => setReelOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

import { useState } from "react";
import { Ban, Plus, Check } from "lucide-react"; // Ensure you have lucide-react installed

type Props = {
  chunkId: string;
  postUri: string;
};

export default function AddPostToChunkButton({ chunkId, postUri }: Props) {
  const [state, setState] = useState<'addable' | 'adding' | 'added' | 'error'>('addable');

  const addToChunk = async () => {
    try {
      setState('adding');

      fetch(`/api/chunks/${chunkId}/add-post?uri=${encodeURIComponent(postUri)}`, {
        method: 'post'
      })
        .then((res) => res.json())
        .then((data) => setState('added'))
        .catch((err) => {
          console.error(err);
          setState('error');
        });
    } catch (err) {
      console.error("Add failed", err);
      setState('error');
    }
  };

  return (
    <button
      onClick={addToChunk}
      disabled={state != 'addable'}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      {state === 'addable' ? <><Plus size={18}/>Add to Chunk</> : null}
      {state === 'adding' ? <><Plus size={18}/>Adding</> : null}
      {state === 'added' ? <><Check size={18}/>Added</> : null}
      {state === 'error' ? <><Ban size={18}/>Error</> : null}
    </button>
  );
}

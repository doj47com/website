import { useState } from "react";
import { Trash, Ban, Check } from "lucide-react";

type Props = {
  chunkId: string;
  postUri: string;
};

export default function DeleteChunkPostButton({ chunkId, postUri }: Props) {
  const [state, setState] = useState<'trashable' | 'trashing' | 'trashed' | 'error'>('trashable');

  const deleteFromChunk = async () => {
    try {
      setState('trashing');

      fetch(`/api/chunks/${chunkId}/delete-post?uri=${encodeURIComponent(postUri)}`, {
        method: 'post'
      })
        .then((res) => res.json())
        .then((data) => setState('trashed'))
        .catch((err) => {
          console.error(err);
          setState('error');
        });
    } catch (err) {
      console.error("Trash failed", err);
      setState('error');
    }
  };

  return (
    <button
      onClick={deleteFromChunk}
      disabled={state != 'trashable'}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      {state === 'trashable' ? <><Trash size={18}/>Delete</> : null}
      {state === 'trashing' ? <><Trash size={18}/>Deleting</> : null}
      {state === 'trashed' ? <><Check size={18}/>Deleted</> : null}
      {state === 'error' ? <><Ban size={18}/>Error</> : null}
    </button>
  );
}

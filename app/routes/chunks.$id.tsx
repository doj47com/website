import { json, LoaderFunction, useLoaderData } from "@remix-run/react";
import { useFetcher } from "@remix-run/react";
import { useState } from "react";
import { getChunk, getChunkPosts } from "~/utils/db.server";
import { requireAuth } from '~/utils/auth.server';
import Post from '~/components/Post';
import DeleteChunkPostButton from '~/components/DeleteChunkPostButton';

export const loader: LoaderFunction = async ({ request, params }) => {
  requireAuth(request);
  const id = Number(params.id);
  if (isNaN(id)) throw new Response("Invalid ID", { status: 400 });

  const chunk = getChunk(id);
  if (!chunk) throw new Response("Not Found", { status: 404 });
  
  const posts = getChunkPosts(id);

  return json({ chunk, posts });
};

export default function ChunkPage() {
  const { chunk, posts } = useLoaderData<typeof loader>();

  const [showDelete, setShowDelete] = useState(false);

  return (
   <div className="flex min-h-screen">
    {/* Left column */}
    <aside className="w-1/3 bg-gray-100 p-4">
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <div className='italic'>from <a href={`/${chunk.slug}`}>/{chunk.slug}</a></div>

        <FieldEditor field="ts" value={chunk.ts} id={chunk.id} label="Timestamp" />
        <FieldEditor field="title" value={chunk.title} id={chunk.id} label="Title" />
        <FieldEditor field="body" value={chunk.body} id={chunk.id} label="Body" isTextArea />

        {!showDelete && <button
          onClick={() => setShowDelete(true)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
        >
          Delete chunk?
        </button>}
        {showDelete && (
        <form method="POST" action={`/api/chunks/${chunk.id}/delete`} className="">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Delete chunk
          </button>
        </form>)}
      </div>
    </aside>
   <main className="flex-1 p-6">
    <h1 className="text-2xl font-bold mb-5">Edit Chunk #{chunk.id}</h1>
     <a href={`/search-posts?chunk=${chunk.id}`}>add posts</a>
     {posts.map(post => {
       return <>
         <hr className='my-4'/>
         <Post key={post.postUri} post={post.post} stats={false}/>
         <DeleteChunkPostButton chunkId={post.chunkId} postUri={post.postUri} />
       </>
     })}
  </main>
</div>
  );
}

function FieldEditor({
  field,
  value,
  id,
  label,
  isTextArea = false,
}: {
  field: string;
  value: string;
  id: number;
  label: string;
  isTextArea?: boolean;
}) {
  const fetcher = useFetcher();
  const [inputValue, setInputValue] = useState(value);

  const handleBlur = () => {
    if (inputValue !== value) {
      fetcher.submit(
        null,
        {
          method: "POST",
          action: `/api/chunks/${id}/set-field?field=${encodeURIComponent(
            field
          )}&value=${encodeURIComponent(inputValue)}`,
        }
      );
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {isTextArea ? (
        <textarea
          className="w-full border rounded-md p-2"
          rows="10"
          defaultValue={value}
          onBlur={handleBlur}
          onChange={(e) => setInputValue(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className="w-full border rounded-md p-2"
          defaultValue={value}
          onBlur={handleBlur}
          onChange={(e) => setInputValue(e.target.value)}
        />
      )}
      {fetcher.state === "submitting" && (
        <div className="text-xs text-gray-500 mt-1 animate-pulse">Saving...</div>
      )}
    </div>
  );
}


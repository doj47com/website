import React from 'react';
import { useChunks } from '~/hooks/useChunks';

import Chunk from '~/components/Chunk';
import LoggedIn from '~/components/LoggedIn';
import Post from '~/components/Post';
import MDXRenderer from '~/components/MDXRenderer';

function MaybeEdit({ chunkId }) {
  return <LoggedIn>(<a href={`/chunks/${chunkId}`}>edit</a>)</LoggedIn>;
}

function ExternalLink({ post }) {
  const createdAt = post.record?.createdAt;
  const ext = post.embed?.external;

  if (!ext)
    return null;

  const domain = new URL(ext.uri).hostname;

  // ext.description, ext.title, ext.uri, ext.thumb, ext.thumb.size
  return <li><i>{createdAt.substring(0, 10)}</i> <a href={ext.uri}>{ext.title}</a> ({domain})</li>;
  return <pre>{JSON.stringify(post, null, 2)}</pre>;
}

function NewsChunk({ chunk }) {
  return <>
    <h2>News <MaybeEdit chunkId={chunk.id}/></h2>
    {!!chunk.body.trim() && <MDXRenderer code={chunk.body}/>}
    <ul>
      {chunk.posts.map(post => {
        //return <pre>{JSON.stringify(post)}</pre>;
        return <ExternalLink key={post.uri} post={post.post}/>;
      })}
    </ul>
  </>
}

export default function Chunks(props: Props) {
  const chunks = useChunks();

  if (chunks.length === 0)
    return;

  const newsChunk = chunks.find(chunk => chunk.title === 'news');
  return <>
    {!!newsChunk && <NewsChunk chunk={newsChunk}/>}
    {chunks.filter(chunk => chunk.title !== 'news').map(chunk => {
      return <Chunk key={chunk.id} chunk={chunk} />
    })}
  </>
}

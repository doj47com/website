import React from 'react';
import { useChunks } from '~/hooks/useChunks';
import LoggedIn from '~/components/LoggedIn';
import Post from '~/components/Post';
import MDXRenderer from '~/components/MDXRenderer';

export default function Chunks(props: Props) {
  const chunks = useChunks();

  if (chunks.length === 0)
    return;

  return <>
    {chunks.map(chunk => {
      return <React.Fragment key={chunk.id}>
        <h2>{chunk.title} <LoggedIn>(<a href={`/chunks/${chunk.id}`}>edit</a>)</LoggedIn></h2>
        {!!chunk.body.trim() && <MDXRenderer code={chunk.body}/>}
        {chunk.posts.map(post => {
          //return <pre>{JSON.stringify(post)}</pre>;
          return <Post key={post.uri} post={post.post} stats={false}/>;
        })}
      </React.Fragment>
    })}
  </>
}

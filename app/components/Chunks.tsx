import React from 'react';
import { useChunks } from '~/hooks/useChunks';
import LoggedIn from '~/components/LoggedIn';
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
        <pre>
          {JSON.stringify(chunk, null, 2)}
        </pre>
      </React.Fragment>
    })}
  </>
}

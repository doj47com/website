import LoggedIn from '~/components/LoggedIn';
import Post from '~/components/Post';
import MDXRenderer from '~/components/MDXRenderer';

function MaybeEdit({ chunkId }) {
  return <LoggedIn>(<a href={`/chunks/${chunkId}`}>edit</a>)</LoggedIn>;
}

export default function Chunk({ chunk, foreign }) {
  return <>
    <h2>{chunk.title} <MaybeEdit chunkId={chunk.id}/><br/><i className='text-sm'>{chunk.ts.substring(0, 10)} {!!foreign && <a href={`/` + chunk.slug }>/{chunk.slug}</a>}</i></h2>
    {!!chunk.body.trim() && <MDXRenderer code={chunk.body}/>}
    {chunk.posts.map(post => {
      return <Post key={post.uri} post={post.post} stats={false}/>;
    })}
  </>
}

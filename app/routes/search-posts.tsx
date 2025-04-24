import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { requireAuth } from '../utils/auth.server';
import { LoaderFunction, MetaFunction, json } from "@remix-run/node";
import Frame from '../components/Frame';
import CopyButton from '../components/CopyButton';
import AddPostToChunkButton from '../components/AddPostToChunkButton';
import SearchBox from '../components/SearchBox';
import Post from '../components/Post';

export const meta: MetaFunction = () => {
  return [
    { title: "doj47 - Search posts" },
    { name: "description", content: "Search posts from legal twitter." },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  requireAuth(request);
  return json({});
};


export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState(searchParams.get('sort') || 'DESC');
  const [value, setValue] = useState(searchParams.get('q') || '');
  const [replies, setReplies] = useState(Number(searchParams.get('replies') || '0'));
  const [handle, setHandle] = useState(searchParams.get('handle') || '');
  const [after, setAfter] = useState(searchParams.get('after') || '');
  const [before, setBefore] = useState(searchParams.get('before') || '');
  const [offset, setOffset] = useState(Number(searchParams.get('offset') || '0'));
  const chunkId = searchParams.get('chunk') || '';
  const [results, setResults] = useState([]);
  const [likes, setLikes] = useState(searchParams.get('likes') || '');
  const [reposts, setReposts] = useState(searchParams.get('reposts') || '');
  const [quotes, setQuotes] = useState(searchParams.get('quotes') || '');
  const [ms, setMs] = useState(undefined);

  function updateSearchParams(params) {
    const newParams = new URLSearchParams(searchParams); // clone existing
    for (const [k, v] of Object.entries(params)) {
      newParams.set(k, v)
    }

    setSearchParams(newParams);
  }

  function doTheThing(controller?: AbortController) {
    const now = Date.now();
    fetch(`/api/search-posts?q=${encodeURIComponent(value)}&handle=${encodeURIComponent(handle)}&before=${encodeURIComponent(before)}&after=${encodeURIComponent(after)}&offset=${offset}&sort=${sort}&replies=${replies}&likes=${likes}&reposts=${reposts}&quotes=${quotes}`, {
      ...(controller ? { signal: controller.signal } : {}),
    })
      .then((res) => res.json())
      .then((data) => {
        setMs(Date.now() - now);
        setResults(data.results)
      })
      .catch((err) => {
        setMs(Date.now() - now);
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err);
        }
      });
  }

  useEffect(() => doTheThing, []);

  useEffect(() => {
    updateSearchParams({
      q: value,
      handle,
      after,
      before,
      offset,
      sort,
      replies,
      likes,
      reposts,
      quotes,
    });

    /*
    if (value === '') {
      setResults([]);
      return;
    }
     */

    const controller = new AbortController(); // to cancel if new request comes in quickly
    const delayDebounce = setTimeout(() => {
      doTheThing(controller);
    }, 300); // debounce delay

    return () => {
      clearTimeout(delayDebounce);
      controller.abort();
    };
  }, [value, handle, before, after, offset, sort, replies, likes, reposts, quotes]);

  function PaginationControls() {
    return (
      <div>
        {offset > 0 && <a className='cursor-pointer' onClick={() => setOffset(offset - 100)}>« Prev</a>}
        <> </>
        {results.length === 100 && <a className='cursor-pointer' onClick={() => setOffset(offset + 100)}>Next »</a>}
      </div>
    )
  }

  function addDays(iso: string, days: number) {
    const d = new Date(iso);
    d.setDate(d.getDate() + days);
    return d.toISOString().substring(0, 10);
  }

  function DayControls() {
    if (!before)
      return;

    if (!after)
      return;

    const prevMax = after;
    const prevMin = addDays(after, -1);

    const nextMin = before;
    const nextMax = addDays(before, 1);

    return (
      <div>
        <a className='cursor-pointer' onClick={() => { setBefore(prevMax); setAfter(prevMin); }}>« Prev Day</a>
        <> </>
        <a className='cursor-pointer' onClick={() => { setBefore(nextMax); setAfter(nextMin); } }>Next Day »</a>
      </div>
    )
  }


  return <Frame>
    <SearchBox value={value} onChange={(value) => { setValue(value); setOffset(0); }}/>
    <div className='max-w-md flex'>
      <SearchBox value={handle} onChange={(value) => setHandle(value)} placeholder='Handle' width='inline'/>
      <SearchBox value={after} onChange={(value) => setAfter(value)} placeholder='After' width='inline'/>
      <SearchBox value={before} onChange={(value) => setBefore(value)} placeholder='Before' width='inline'/>
    </div>
    <div className='max-w-md flex'>
      <SearchBox value={likes} onChange={(value) => setLikes(value)} placeholder='Likes' width='inline'/>
      <SearchBox value={reposts} onChange={(value) => setReposts(value)} placeholder='Reposts' width='inline'/>
      <SearchBox value={quotes} onChange={(value) => setQuotes(value)} placeholder='Quotes' width='inline'/>
      <div>
        <label className="inline-flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500" value={replies} onChange={(e) => setReplies(e.target.checked ? 1 : 0) }/>
          <span className="text-gray-800 text-sm">All replies</span>
        </label>
      </div>
    </div>

    <p>Results took {ms} ms, sorting <a onClick={() => setSort(sort === 'ASC' ? 'DESC' : 'ASC')} className='cursor-pointer'>{sort === 'ASC' ? 'oldest first' : 'newest first'}</a>.
      <PaginationControls/>
      <DayControls/>
    </p>
    {results.map((result, idx) => {
      const uri = `https://bsky.app/profile/${result.uri.replace('at://', '').replace('app.bsky.feed.', '')}`;
      return <React.Fragment key={result.uri}>
        {/*<div className='mb-4'>*/}
        <div className="flex items-start mb-4">
          <div className="flex-1 max-w-2xl">

            {/*<a target='_blank' href={uri}>Post by {result.author.displayName}</a> on {result.record.createdAt}*/}
            <Post post={result}/>
          </div>
          <div className="flex flex-col items-start space-y-2 pl-4">
              <p className='text-2xl'>{Number(offset) + idx + 1}</p>
              <CopyButton text={JSON.stringify(result)}/>
              {!!chunkId && <AddPostToChunkButton chunkId={chunkId} postUri={result.uri}/>}
          </div>
        </div>
      </React.Fragment>
    })}
    <PaginationControls/>
    <DayControls/>

    <hr/>
    <p>You can search for a term, or copy/paste a Bluesky URL. Examples:</p>
    <ul>
      <li>a <a href="/search-posts?q=https%3A%2F%2Fbsky.app%2Fprofile%2Fdid%3Aplc%3A24vynkvx5iwtjo4tokbkyqpx%2Fpost%2F3llgzp5ug2s22">Bluesky post URL (DID)</a></li>
      <li>a <a href="/search-posts?q=https%3A%2F%2Fbsky.app%2Fprofile%2Ffolderalconspiracy.bsky.social%2Fpost%2F3llgzp5ug2s22">Bluesky post URL (handle)</a></li>
    </ul>
    <hr/>
    <p>Example posts for testing the renderer:</p>
    <ul>
      <li><a href="/search-posts?q=https%3A%2F%2Fbsky.app%2Fprofile%2Fdid%3Aplc%3A756gaaeewovgn4axja34ajne%2Fpost%2F3lmk6frgjjs2y">text</a></li>
      <li><a href="/search-posts?q=https%3A%2F%2Fbsky.app%2Fprofile%2Fgabrielmalor.bsky.social%2Fpost%2F3lmk6qxhogt2y">text with image</a></li>
      <li><a href="/search-posts?q=https%3A%2F%2Fbsky.app%2Fprofile%2Fdid%3Aplc%3Avrmx2e5gsi23srsy2n7vljvb%2Fpost%2F3lmjvr6tcv22y">text with two images</a></li>
      <li><a href="/search-posts?q=https%3A%2F%2Fbsky.app%2Fprofile%2Fdid%3Aplc%3Anwnlnixtjh3qhkwpz2uy5uwv%2Fpost%2F3lmk2brme3c25">text with external URL</a> (<a href="/search-posts?q=https%3A%2F%2Fbsky.app%2Fprofile%2Fdid%3Aplc%3Abbp2b224lro3bfnzcqwwnkfo%2Fpost%2F3lmjmuafv622v">alternate</a>)</li>
      <li><a href="/search-posts?q=https%3A%2F%2Fbsky.app%2Fprofile%2Fdid%3Aplc%3A4llrhdclvdlmmynkwsmg5tdc%2Fpost%2F3lmdcovngwg2f">text with video</a></li>
      <li><a href="/search-posts?q=https%3A%2F%2Fbsky.app%2Fprofile%2Fdid%3Aplc%3A24vynkvx5iwtjo4tokbkyqpx%2Fpost%2F3llgzp5ug2s22">QT: text on text</a></li>
      <li><a href="/search-posts?q=https%3A%2F%2Fbsky.app%2Fprofile%2Fdid%3Aplc%3A2snxsa5duga2tnczzsk6lbl4%2Fpost%2F3lgvnbuy2d22u">QT: text on image</a></li>
      <li><a href="/search-posts?q=https%3A%2F%2Fbsky.app%2Fprofile%2Fdid%3Aplc%3Ayokssolxkvz4lobktvx6yvxb%2Fpost%2F3lmki6jowhs2u">QT: image on text</a></li>
      <li><a href="/search-posts?q=https%3A%2F%2Fbsky.app%2Fprofile%2Fdid%3Aplc%3Adlmur6emtjntr5n5qysgrdos%2Fpost%2F3lmk5kri4xk2s">QT: text on external URL</a></li>
    </ul>

  </Frame>;
}


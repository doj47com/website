import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import type { MetaFunction } from "@remix-run/node";
import Frame from '../components/Frame';
import CopyButton from '../components/CopyButton';
import SearchBox from '../components/SearchBox';
import Post from '../components/Post';

export const meta: MetaFunction = () => {
  return [
    { title: "doj47 - Search posts" },
    { name: "description", content: "Search posts from legal twitter." },
  ];
};


export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }

    if (value === '') {
      setResults([]);
      return;
    }

    const controller = new AbortController(); // to cancel if new request comes in quickly
    const delayDebounce = setTimeout(() => {
      fetch(`/api/search-posts?q=${encodeURIComponent(value)}`, {
        signal: controller.signal
      })
        .then((res) => res.json())
        .then((data) => setResults(data.results))
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error("Fetch error:", err);
          }
        });
    }, 300); // debounce delay

    return () => {
      clearTimeout(delayDebounce);
      controller.abort();
    };
  }, [value]);
  return <Frame>
    <SearchBox value={value} onChange={(value) => setValue(value)}/>

    <p>
      Value is: {value}
    </p>

    <p>Results are:</p>
    {results.map(result => {
      const uri = `https://bsky.app/profile/${result.uri.replace('at://', '').replace('app.bsky.feed.', '')}`;
      return <React.Fragment key={result.uri}>
        <div className='mb-4'>
          <a target='_blank' href={uri}>Post by {result.author.displayName}</a> on {result.record.createdAt}
          <br/><CopyButton text={JSON.stringify(result)}/>
          <Post post={result}/>
        </div>
        <hr/>
      </React.Fragment>
    })}

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
      <li><a href="/search-posts?q=https%3A%2F%2Fbsky.app%2Fprofile%2Fdid%3Aplc%3Anwnlnixtjh3qhkwpz2uy5uwv%2Fpost%2F3lmk2brme3c25">text with external URL</a></li>
      <li><a href="/search-posts?q=https%3A%2F%2Fbsky.app%2Fprofile%2Fdid%3Aplc%3A4llrhdclvdlmmynkwsmg5tdc%2Fpost%2F3lmdcovngwg2f">text with video</a></li>
      <li><a href="/search-posts?q=https%3A%2F%2Fbsky.app%2Fprofile%2Fdid%3Aplc%3A24vynkvx5iwtjo4tokbkyqpx%2Fpost%2F3llgzp5ug2s22">QT: text on text</a></li>
      <li><a href="/search-posts?q=https%3A%2F%2Fbsky.app%2Fprofile%2Fdid%3Aplc%3Ayokssolxkvz4lobktvx6yvxb%2Fpost%2F3lmki6jowhs2u">QT: image on text</a></li>
      <li><a href="/search-posts?q=https%3A%2F%2Fbsky.app%2Fprofile%2Fdid%3Aplc%3Adlmur6emtjntr5n5qysgrdos%2Fpost%2F3lmk5kri4xk2s">QT: text on external URL</a></li>
    </ul>

  </Frame>;
}


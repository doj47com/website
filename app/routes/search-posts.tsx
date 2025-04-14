import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import type { MetaFunction } from "@remix-run/node";
import Frame from '../components/Frame';
import CopyButton from '../components/CopyButton';

export const meta: MetaFunction = () => {
  return [
    { title: "doj47 - Search posts" },
    { name: "description", content: "Search posts from legal twitter." },
  ];
};

function SearchBox(props: { onChange: (x: string) => void }) {
  return (
    <div className="max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          onChange={(e) => props.onChange(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

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
    <SearchBox onChange={(value) => setValue(value)}/>

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
        </div>
      </React.Fragment>
    })}
  </Frame>;
}


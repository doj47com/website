import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import type { MetaFunction } from "@remix-run/node";
import Frame from '../components/Frame';
import CopyButton from '../components/CopyButton';
import SearchBox from '../components/SearchBox';

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
        </div>
      </React.Fragment>
    })}
  </Frame>;
}


import React from "react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type External = {
  uri: string;
  thumb: string;
  title: string;
  description: string;
};

function Tweet({
  author,
  text,
  createdAt,
  images,
  children,
}: {
  author: { avatar: string; displayName: string; handle: string };
  text: string;
  createdAt: string;
  images?: string[];
  children?: React.ReactNode;
  external?: External;
}) {
  return (
    <div className="border border-gray-300 rounded-xl p-4 mb-2 text-sm bg-white shadow-sm">
      <div className="flex gap-3 items-center mb-2">
        <img
          src={author.avatar}
          alt={author.displayName}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <div className="font-semibold">{author.displayName}</div>
          <div className="text-gray-500">@{author.handle}</div>
        </div>
      </div>
      <div className="whitespace-pre-wrap mb-3">{text}</div>
      {external && (
        <a href="https://www.stevevladeck.com/p/141-abrego-garcia-and-the-presumption" class="block border rounded-lg overflow-hidden hover:bg-gray-50 transition">
          <img src="https://cdn.bsky.app/img/feed_thumbnail/plain/did:plc:nwnlnixtjh3qhkwpz2uy5uwv/bafkreicfsu7sscoxvkxpfqwlz5bwm5k52watebwvfi5kuy3pzybducdvda@jpeg" alt="embed" class="w-full object-cover max-h-48" />
          <div class="p-3">
            <div class="font-semibold text-gray-900">141. Abrego Garcia and the Presumption of Regularity</div>
            <div class="text-gray-600 text-sm mt-1">How one reads Thursday's ruling ordering the federal government to "facilitate" Abrego Garcia's return depends upon how much (or how little) one expects *this* administration to turn square corners.</div>
          </div>
        </a>
      )}
      {images && images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt=""
              className="rounded-lg border border-gray-200 w-full object-cover"
            />
          ))}
        </div>
      )}
      {children && <div>{children}</div>}
      <div className="text-xs text-gray-400 mt-3">{formatDate(createdAt)}</div>
    </div>
  );
}

type Props = { post: any; };

export default function Post(props: Props) {
  const { post } = props;
  console.log(post);

  let subtweet = null;
  //console.log(post.embed.record.embeds);
  console.log(post.embed);

  let external: External;
  if (post.embed?.$type === 'app.bsky.embed.external#view') {
    external = post.embed.external;
  }

  // app.bsky.embed.record#view
  if (post.embed?.$type === 'app.bsky.embed.record#view') {
    console.log(post.embed);
    subtweet = <Tweet
      author={{
        avatar: post.embed.record.author.avatar,
        displayName: post.embed.record.author.displayName,
        handle: post.embed.record.author.handle,
      }}
      createdAt={post.embed.record.value.createdAt}
      text={post.embed.record.value.text}
      external={external}
    />
  }

  let images: string[] = [];
  if (post.embed?.$type === 'app.bsky.embed.images#view') {
    images = post.embed.images.map(img => img.thumb);
  }

  return (
    <Tweet
      author={{
        avatar: post.author.avatar,
        displayName: post.author.displayName,
        handle: post.author.handle,
      }}
      createdAt={post.record.createdAt}
      text={post.record.text}
      images={images}
      external={external}
    >
      {subtweet}
    </Tweet>
  );
}


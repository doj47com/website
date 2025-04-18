import React from "react";
import Video from './Video';
import Lightbox from './Lightbox';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function shorten(n) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : n;
}

type External = {
  uri: string;
  thumb: string;
  title: string;
  description: string;
};

type Video = {
  playlist: string;
  thumbnail: string;
};

type TweetProps = {
  author: { avatar: string; displayName: string; handle: string };
  text: string;
  createdAt: string;
  isNested?: boolean;
  images?: Image[];
  children?: React.ReactNode;
  external?: External | null | undefined;
  video?: Video | null | undefined;
  likeCount?: number;
  postCount?: number;
  replyCount?: number;
  quoteCount?: number;
};

function Tweet(props: TweetProps) {
  const { author, rkey, text, createdAt, images, isNested, children, external, video, likeCount, repostCount, quoteCount } = props;
  console.log(props);
  console.log(external);

  const profileUrl = `https://bsky.app/profile/${author.handle}`;
  const postUrl = `https://bsky.app/profile/${author.handle}/post/${rkey}`;

  function maybeWrap(node: React.ReactNode): JSX.Element {
    if (isNested)
      return node;

    return <div className='max-w-2xl'>{node}</div>
  }

  return maybeWrap(
    <div className="border border-gray-300 rounded-xl p-4 mb-2 text-sm bg-white shadow-sm">
      <div className="flex gap-3 items-center mb-2">
        <a href={profileUrl}><img
          src={author.avatar}
          alt={author.displayName}
          className="w-10 h-10 rounded-full"
        /></a>
        <div>
          <div className="text-black font-semibold"><a href={profileUrl} className='text-black hover:text-black'>{author.displayName}</a></div>
          <div className="text-gray-500"><a href={profileUrl} className='text-gray-500 hover:text-gray-500'>@{author.handle}</a> · <a href={postUrl} className='text-gray-500 hover:text-gray-500'>{formatDate(createdAt)}</a></div>
        </div>
      </div>
      <div className="whitespace-pre-wrap mb-3">{text}</div>
      {!!external && (
        <a href={external.uri} className="block border rounded-lg overflow-hidden hover:bg-gray-50 transition">
          <img src={external.thumb} alt="embed" className="w-full object-cover max-h-48" />
          <div className="p-3">
            <div className="font-semibold text-gray-900">{external.title}</div>
            <div className="text-gray-600 text-sm mt-1">{external.description}</div>
          </div>
        </a>
      )}
      {images && images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/*
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt=""
              className="rounded-lg border border-gray-200 w-full object-cover"
            />
          ))}
            */}
          {images.map((img, idx) => (
            <Lightbox
              key={img.fullsize}
              alt={img.alt}
              thumb={img.thumb}
              fullsize={img.fullsize}
            />
          ))}
        </div>
      )}
      {video && <Video {...video}/>}
      {children && <div>{children}</div>}
      {!!(!isNested && (repostCount || quoteCount || likeCount)) && (
        <div class="flex gap-4 text-xs text-gray-500 pt-3">
          {!!repostCount && <span><span class="font-semibold text-gray-800">{shorten(repostCount)}</span> repost{repostCount > 1 ? 's' : ''}</span>}
          {!!quoteCount && <span><span class="font-semibold text-gray-800">{shorten(quoteCount)}</span> quote{quoteCount > 1 ? 's' : ''}</span>}
          {!!likeCount && <span><span class="font-semibold text-gray-800">{shorten(likeCount)}</span> like{likeCount > 1 ? 's' : ''}</span>}
        </div>
      )}

    </div>
  );
}

type Props = { post: any; };

type Image = {
  alt?: string;
  fullsize: string;
  thumb: string;
};

function extractImages(imagesArray: any[]): Image[] {
  return imagesArray;
}

export default function Post(props: Props) {
  const { post } = props;
  //console.log(post);

  let subtweet = null;
  const rkey = post.uri.replace(/.*[/]/, '');
  //console.log(post.embed.record.embeds);
  //console.log(post.embed);

  let external: External | undefined | null = undefined;
  if (post.embed?.$type === 'app.bsky.embed.external#view') {
    external = post.embed.external;
  }

  let video: Video | undefined;
  if (post.embed?.$type === 'app.bsky.embed.video#view') {
    console.log(`itsa video`, post.embed);
    video = post.embed as Video;
  }

  // app.bsky.embed.record#view
  if (post.embed?.$type === 'app.bsky.embed.record#view') {
    console.log('embed', post.embed);

    const embeddedEmbeds = post.embed.record?.embeds || [];
    // http://localhost:5173/search-posts?q=https%3A%2F%2Fbsky.app%2Fprofile%2Fdid%3Aplc%3Adlmur6emtjntr5n5qysgrdos%2Fpost%2F3lmk5kri4xk2s
    // https://gist.github.com/cldellow/ef42cfca25f21a90ec1383e35ec85c18#file-qt-text-on-url-json-L28
    let subtweetExternal: External | undefined;
    if (embeddedEmbeds?.[0]?.$type === 'app.bsky.embed.external#view') {
      subtweetExternal = embeddedEmbeds[0].external as External;
    }
    let images: Image[] = [];
    const embeddedImages = embeddedEmbeds.find(x => x.$type === 'app.bsky.embed.images#view');
    if (embeddedImages)
      images = extractImages(embeddedImages.images);

    const rkey = post.embed.record.uri.replace(/.*[/]/, '');
    subtweet = <Tweet
      rkey={rkey}
      author={{
        avatar: post.embed.record.author.avatar,
        displayName: post.embed.record.author.displayName,
        handle: post.embed.record.author.handle,
      }}
      createdAt={post.embed.record.value.createdAt}
      text={post.embed.record.value.text}
      external={subtweetExternal}
      isNested={true}
      images={images}
    />
  }

  let images: Image[] = [];
  if (post.embed?.$type === 'app.bsky.embed.images#view') {
    images = extractImages(post.embed.images);
  }

  if (post.embed?.$type === 'app.bsky.embed.recordWithMedia#view') {
    // https://bsky.app/profile/did:plc:yokssolxkvz4lobktvx6yvxb/post/3lmki6jowhs2u
    // https://gist.github.com/cldellow/ff0da4b0cfe8bb592b47e21112d2d555
    if (post.embed.media?.$type === 'app.bsky.embed.images#view') {
      images = extractImages(post.embed.media.images);
    }

    const quotedRecord = post.embed.record.record;
    console.log('quotedRecord', quotedRecord);

    const rkey = quotedRecord.uri.replace(/.*[/]/, '');
    subtweet = <Tweet
      rkey={rkey}
      author={{
        avatar: quotedRecord.author.avatar,
        displayName: quotedRecord.author.displayName,
        handle: quotedRecord.author.handle,
      }}
      createdAt={quotedRecord.value.createdAt}
      isNested={true}
      text={quotedRecord.value.text}
      external={external}
      video={video}
    />
  }

  return (
    <Tweet
      rkey={rkey}
      author={{
        avatar: post.author.avatar,
        displayName: post.author.displayName,
        handle: post.author.handle,
      }}
      createdAt={post.record.createdAt}
      text={post.record.text}
      images={images}
      external={external}
      video={video}
      likeCount={post.likeCount}
      quoteCount={post.quoteCount}
      replyCount={post.replyCount}
      repostCount={post.repostCount}
    >
      {subtweet}
    </Tweet>
  );
}


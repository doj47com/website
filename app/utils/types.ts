export type ChunkPost = {
  chunkId: number;
  postUri: string;
  liveTweet: boolean;
  newsLink: boolean;
  post: unknown;
};

export type Chunk = {
  id: number;
  slug: string;
  ts: string;
  title: string;
  body: string;
  posts: ChunkPost[];
};



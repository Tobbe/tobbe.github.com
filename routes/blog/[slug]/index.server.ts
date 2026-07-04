import { getParams, htmlToResponse, readDir } from "@mastrojs/mastro";
import { readMarkdownFile } from "@mastrojs/markdown";
import { Post } from "../../../components/Post.ts";

// TODO: Replace this with proper schema validation
interface PostMeta {
  title: string;
  date: string;
  subtitle?: string;
  cover?: string;
  coverAlt?: string;
  canonicalUrl?: string;
  [index: string]: any;
}

export const GET = async (req: Request) => {
  const { slug } = getParams(req);

  const post = await readMarkdownFile<PostMeta>(`data/posts/${slug}.md`);

  return htmlToResponse(
    Post({
      title: post.meta.title,
      subtitle: post.meta.subtitle,
      cover: post.meta.cover,
      coverAlt: post.meta.coverAlt,
      canonicalUrl: post.meta.canonicalUrl,
      children: post.content,
    }),
  );
};

export const getStaticPaths = async () => {
  const posts = await readDir("data/posts/");
  return posts.map((p) => "/blog/" + p.slice(0, -3) + "/");
};

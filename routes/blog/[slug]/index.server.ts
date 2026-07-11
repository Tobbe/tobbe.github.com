import { getParams, readDir } from "@mastrojs/mastro";
import { renderPost } from "../../../lib/posts.ts";

export const GET = async (req: Request) => {
  const { slug } = getParams(req);
  return renderPost("posts", slug);
};

export const getStaticPaths = async () => {
  const posts = await readDir("data/posts/");
  return posts.map((p) => "/blog/" + p.slice(0, -3) + "/");
};

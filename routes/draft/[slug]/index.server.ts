import { getParams, readDir } from "@mastrojs/mastro";
import { renderPost } from "../../../lib/posts.ts";

export const GET = async (req: Request) => {
  const { slug } = getParams(req);
  return renderPost("drafts", slug);
};

export const getStaticPaths = async () => {
  const drafts = await readDir("data/drafts/");
  return drafts.map((d) => "/draft/" + d.slice(0, -3) + "/");
};

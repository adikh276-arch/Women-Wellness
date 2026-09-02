import ArticleStoryPage from "@/views/ArticleStory"

export function generateStaticParams() {
  const slugs = ["pcos", "reproductive-health", "medical-conditions", "nutrition-weight", "pregnancy-postpartum", "mental-health", "fertility", "menopause"];
  const resources = ["articles", "stories"];
  const params: {slug: string, resource: string, index: string}[] = [];
  slugs.forEach(slug => resources.forEach(resource => {
    for (let index = 0; index < 20; index++) params.push({ slug, resource, index: index.toString() })
  }));
  return params;
}

export default function ArticleStory() { return <ArticleStoryPage /> }
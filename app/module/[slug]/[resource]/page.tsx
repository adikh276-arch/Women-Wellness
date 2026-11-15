import ResourcePage from "@/views/Resource"

export function generateStaticParams() {
  const slugs = ["pcos", "reproductive-health", "medical-conditions", "nutrition-weight", "pregnancy-postpartum", "mental-health", "fertility", "menopause"];
  const resources = ["articles", "tips", "stories", "understanding", "myths", "working-mothers-articles"];
  const params: { slug: string; resource: string }[] = [];
  slugs.forEach(slug => resources.forEach(resource => params.push({ slug, resource })));
  return params;
}

export default function Resource() { return <ResourcePage /> }

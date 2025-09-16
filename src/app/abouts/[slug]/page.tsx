import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRenderer } from '@/components/mdx-renderer';

import { ENV } from '@/lib/constants';
import { getContents } from '@/lib/contents';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { slug } = await params;
  let about = getContents('abouts').find((post) => post.slug === slug);
  if (!about) return;

  let { summary: description, image } = about.metadata;
  const title = slug.charAt(0).toUpperCase() + slug.slice(1);
  let ogImage = image
    ? `${ENV.NEXT_PUBLIC_WEBSITE_URL}${image}`
    : `${ENV.NEXT_PUBLIC_WEBSITE_URL}/api/og?title=${title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${ENV.NEXT_PUBLIC_WEBSITE_URL}/abouts/${about.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export async function generateStaticParams() {
  const abouts = getContents('abouts');
  return abouts.map((about) => ({ slug: about.slug }));
}

export default async function AboutPage({ params }: Props) {
  const { slug } = await params;
  const about = getContents('abouts').find((about) => about.slug === slug);
  if (!about) notFound();

  return (
    <MDXRenderer
      limitWidth={false}
      source={about.content}
      components={{
        pre: (props) => <pre className="bg-transparent p-0" {...props} />,
      }}
    />
  );
}

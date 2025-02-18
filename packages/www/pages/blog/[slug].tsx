import {
  Container,
  Flex,
  Box,
  Heading,
  Link as A,
} from "@livepeer/design-system";
import { blocksToText } from "lib/utils";
import { GraphQLClient } from "graphql-request";
import { print } from "graphql/language/printer";
import { useRouter } from "next/router";
import allPosts from "../../queries/allPosts.gql";
import BlockContent from "@sanity/block-content-to-react";
import client from "lib/client";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import Layout from "layouts/main";
import Link from "next/link";
import BlogPlayer from "components/Site/BlogPlayer";
import React from "react";
import readingTime from "reading-time";
import BlogCTA from "components/Site/BlogCTA";

const serializers = {
  types: {
    code: (props) => (
      <code lang={props.node.language || "text"}>{props.node.code}</code>
    ),
    cta: (props) => (
      <BlogCTA
        title={props.node.title}
        variant={props.node.variant}
        internalLink={props.node.internalLink}
        anchorLink={props.node.anchorLink}
        externalLink={props.node.externalLink}
      />
    ),
    "mux.video": (props) => <BlogPlayer assetId={props.node.asset._ref} />,
  },
};

const Post = ({
  title,
  mainImage,
  author,
  category,
  publishedDate,
  excerpt,
  noindex = false,
  preview,
  contentRaw,
  furtherReading,
  metaTitle,
  metaDescription,
  metaUrl,
  openGraphImage,
}) => {
  const { isFallback, asPath } = useRouter();
  if (isFallback) {
    return (
      <Layout>
        <Box>Loading...</Box>
      </Layout>
    );
  }
  const text = blocksToText(contentRaw);
  const stats = readingTime(text);
  const builder = imageUrlBuilder(client as any);

  return (
    <Layout
      title={metaTitle}
      description={metaDescription}
      noindex={noindex}
      image={{
        url: builder.image(openGraphImage).url(),
        alt: openGraphImage?.alt,
      }}
      url={metaUrl}
      preview={preview}>
      <Box css={{ position: "relative" }}>
        <Container
          size="3"
          css={{
            px: "$3",
            py: "$7",
            width: "100%",
            "@bp3": {
              py: "$8",
              px: "$3",
            },
          }}>
          <Box css={{ maxWidth: 768, mx: "auto" }}>
            <Flex
              css={{
                mb: "$2",
                alignItems: "center",
                fontSize: "$2",
                justifyContent: "space-between",
              }}>
              <Box
                css={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  mr: "$2",
                }}>
                {new Date(publishedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Box>
              {category?.title && (
                <Link
                  href={
                    category.title === "All" ? "/blog" : `/blog/category/[slug]`
                  }
                  as={
                    category.title === "All"
                      ? "/blog"
                      : `/blog/category/${category.slug.current}`
                  }
                  passHref
                  legacyBehavior>
                  <A
                    css={{
                      color: "$hiContrast",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}>
                    {category.title}
                  </A>
                </Link>
              )}
            </Flex>
            <Heading
              as="h1"
              size="4"
              css={{
                mt: "$3",
                mb: "$6",
                fontWeight: 500,
              }}>
              {title}
            </Heading>
            <Flex align="center" css={{ fontSize: "$3", mb: "$6" }}>
              <Flex align="center">
                By
                <Box
                  css={{
                    ml: "$3",
                    mr: "$2",
                    position: "relative",
                    borderRadius: 1000,
                    width: 32,
                    height: 32,
                    overflow: "hidden",
                    img: {
                      objectPosition: "left",
                    },
                  }}>
                  <Image
                    alt={author.image?.alt}
                    src={builder.image(author.image).url()}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Box>
                <Box
                  as="span"
                  css={{
                    fontWeight: 600,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}>
                  {author.name}
                </Box>
              </Flex>
              <Box
                css={{ mx: "$2", width: "1px", height: 16, bc: "$neutral2" }}
              />
              <Box
                css={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}>
                {stats.text}
              </Box>
            </Flex>
            <Box
              css={{
                position: "relative",
                width: "100%",
                borderRadius: 12,
                overflow: "hidden",
                mb: "$2",
                "@bp2": {
                  mb: "$7",
                },
              }}>
              <Image
                alt={mainImage?.alt}
                layout="responsive"
                width={mainImage.asset.metadata.dimensions.width}
                height={mainImage.asset.metadata.dimensions.height}
                src={builder.image(mainImage).url()}
              />
            </Box>
            <Box
              css={{
                "p, div, ul, li": {
                  lineHeight: 1.8,
                  color: "$hiContrast",
                },
                "h1, h2, h3, h4, h5, h6": {
                  color: "$hiContrast",
                  lineHeight: 1.5,
                },
                strong: {
                  color: "$hiContrast",
                },
                em: {
                  color: "$hiContrast",
                },
                figure: {
                  m: 0,
                },
                img: {
                  width: "100%",
                },
                a: {
                  color: "$blue9",
                },
              }}>
              <BlockContent
                blocks={contentRaw}
                serializers={serializers}
                {...client.config()}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

Post.theme = "dark-theme-blue";
export default Post;

export async function getStaticPaths() {
  const graphQLClient = new GraphQLClient(
    "https://dp4k3mpw.api.sanity.io/v1/graphql/production/default"
  );
  const { allPost }: any = await graphQLClient.request(print(allPosts), {
    where: {},
  });

  let paths = [];
  for (const post of allPost) {
    paths.push({ params: { slug: post.slug.current } });
  }
  return {
    fallback: true,
    paths,
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const graphQLClient = new GraphQLClient(
    "https://dp4k3mpw.api.sanity.io/v1/graphql/production/default"
  );

  let data: any = await graphQLClient.request(print(allPosts), {
    where: {},
  });

  let post = data.allPost.find((p) => p.slug.current === slug);

  // TODO: fetch related posts from sanity
  const furtherReading = data.allPost
    .filter((p) => p.slug.current !== slug)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);

  return {
    props: {
      ...post,
      furtherReading,
    },
    revalidate: 1,
  };
}

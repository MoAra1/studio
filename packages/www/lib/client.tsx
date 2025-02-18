import sanityClient from "@sanity/client";
import sanityImage from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const options = {
  dataset: "production",
  projectId: "dp4k3mpw",
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
};

const client = sanityClient(options);

export const urlFor = (source: SanityImageSource) =>
  sanityImage(options).image(source);

export const imageBuilder = sanityImage(client);

export default client;

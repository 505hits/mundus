export type PublicTestimonial = {
  quote: string;
  name: string;
  language?: string;
  detail?: string;
};

// Add only real student quotes that Mundus has permission to publish.
// Do not use generated names, stock identities or unverified marketing claims.
export const PUBLIC_TESTIMONIALS: PublicTestimonial[] = [];

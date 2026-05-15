import { getAdminTestimonials } from "@/app/actions/testimonials";
import TestimonialsAdminClient from "./TestimonialsAdminClient";

export default async function TestimonialsAdminPage() {
  const testimonials = await getAdminTestimonials();
  return <TestimonialsAdminClient testimonials={testimonials} />;
}

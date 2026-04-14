import { getStorefrontData } from "@/src/backend/repositories";
import { HomePage } from "@/src/features/home/home-page";

export default async function Home() {
  const storefront = await getStorefrontData();
  return <HomePage {...storefront} />;
}

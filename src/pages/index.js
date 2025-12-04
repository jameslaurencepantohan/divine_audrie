import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the login page
    router.replace("/login");
  }, [router]);

  return null; // No UI needed since we're redirecting
}

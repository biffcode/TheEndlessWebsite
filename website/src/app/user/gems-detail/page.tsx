"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GemsDetailRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/user/my-balance");
  }, [router]);
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full"></div>
    </div>
  );
} 
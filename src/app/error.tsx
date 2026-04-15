"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="space-y-8 text-center max-w-lg">
        <div className="h-24 w-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center text-red-500 mx-auto shadow-xl shadow-red-500/10 mb-8">
          <XCircle size={48} />
        </div>

        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Something went wrong</h2>
          <p className="text-gray-500 font-medium">We encountered an unexpected error while preparing your experience. Please try again or return home.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => reset()}
            size="lg"
            className="rounded-md h-14 px-8 font-black bg-gray-900 hover:bg-black shadow-xl shadow-gray-200"
          >
            <RefreshCcw size={20} className="mr-2" /> Try Again
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              size="lg"
              className="rounded-md h-14 px-8 font-black border-gray-100"
            >
              <Home size={20} className="mr-2" /> Back Home
            </Button>
          </Link>
        </div>

        {error.digest && (
          <p className="text-[10px] font-black uppercase text-gray-300 tracking-[0.2em] pt-8">
            Error Digest: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}

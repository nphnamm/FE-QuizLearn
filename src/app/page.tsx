import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default function Home() {
  

  return (
      
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-center">
        <h1 className="text-6xl font-bold mb-8">Welcome to QuizLearn</h1>
        <p className="text-xl mb-12">
          A modern learning platform built with Next.js and Redux
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg">Sign in</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg">
              Create account
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

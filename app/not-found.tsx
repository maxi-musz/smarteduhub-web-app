import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-brand-secondary">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-brand-secondary dark:text-white">
          404
        </h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <Link href="/dashboard">
          <span className="text-brand-primary hover:text-brand-primary-accent underline cursor-pointer">
            Return to Home
          </span>
        </Link>
      </div>
    </div>
  );
}

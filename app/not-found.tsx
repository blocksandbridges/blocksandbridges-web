import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto">
      <div className="bnb-page-header">
        <strong>Page Not Found</strong>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="bnb-body-text">
          Oh No, You seem to have taken a wrong turn.<br />
          <Link href="/" className="text-red-600 hover:text-red-600">Go back to the home page</Link>
        </div>
      </div>
    </div>
  );
}

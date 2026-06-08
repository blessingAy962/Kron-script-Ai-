import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <h1 className="mb-4 text-7xl font-bold text-primary font-display">404</h1>
      <p className="mb-6 text-xl text-muted-foreground font-body">Oops! This cinematic link does not exist.</p>
      <Link to="/" className="text-primary underline font-display hover:text-opacity-8 transition-colors">
        Return to Home
      </Link>
    </div>
  );
}
export { NotFound };

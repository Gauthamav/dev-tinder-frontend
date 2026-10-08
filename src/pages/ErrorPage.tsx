import { Link } from 'react-router';

export default function ErrorPage() {
  return (
    <section className="flex items-center min-h-screen justify-center">
      <div className=" flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-4 text-xl">Page Not Found</p>
        <p className="mt-2 text-gray-500">The page you're looking for doesn't exist.</p>
        <Link to={'/'}>
          <button className="mt-6 rounded-md cursor-pointer hover:bg-[#41d87e] bg-black px-6 py-3 text-white">Back To Home</button>
        </Link>
      </div>
    </section>
  );
}

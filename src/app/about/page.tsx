import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Hakkımızda</h1>
      <p className="text-gray-400 max-w-md mb-8">
        Bu sayfa bizim hakkımızda bazı temel bilgileri içerir.
      </p>
      <Link
        href="/"
        className="bg-blue-600 px-5 py-2 rounded text-white hover:bg-blue-700"
      >
        Anasayfa’ya Dön
      </Link>
    </div>
  );
}

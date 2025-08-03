export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">Hakkımızda</h1>
      <p className="text-lg mb-6">
        Bu sayfa bizim hakkımızda bazı temel bilgileri içerir.
      </p>
      <a
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
      >
        Anasayfa’ya Dön
      </a>
    </main>
  );
}

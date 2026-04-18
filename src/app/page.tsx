export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <header>
        <h1 className="text-4xl font-bold">Quiet Chatter</h1>
        <p className="text-gray-600 mt-2 text-center italic">You Belong Here</p>
      </header>

      <main className="flex flex-col items-center gap-4">
        <a 
          href="/api/auth/naver"
          className="bg-[#03C75A] text-white px-6 py-3 rounded-md font-bold flex items-center gap-2 hover:bg-[#02b350] transition-colors"
        >
          네이버로 시작하기
        </a>
      </main>

      <footer className="mt-16 text-sm text-gray-500">
        © 2026 Quiet Chatter. All rights reserved.
      </footer>
    </div>
  );
}

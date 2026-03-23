import Header from "@/components/Header";

export const metadata = {
  title: "Блог",
  description: "Новости и статьи от команды skillsbd",
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Блог</h1>
        <p className="text-gray-500 mb-8">Новости, гайды и статьи о навыках для AI-агентов.</p>

        <div className="rounded-lg border border-gray-800 bg-gray-900 p-12 text-center">
          <p className="text-gray-500 text-lg mb-2">Скоро здесь появятся статьи</p>
          <p className="text-gray-600 text-sm">
            Подпишитесь на{" "}
            <a
              href="https://t.me/neuraldeep"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Telegram-канал
            </a>{" "}
            чтобы не пропустить
          </p>
        </div>
      </main>
    </>
  );
}

import Header from "@/components/Header";

export const metadata = {
  title: "Политика конфиденциальности",
  description: "Политика конфиденциальности skillsbd",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Политика конфиденциальности</h1>

        <div className="flex flex-col gap-6 text-gray-400 text-sm leading-relaxed">
          <p>Дата вступления в силу: 23 марта 2026 г.</p>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Какие данные мы собираем</h2>
            <p>
              При авторизации через GitHub мы получаем ваше имя, email и аватар из вашего
              профиля GitHub. Мы не собираем и не храним пароли.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Как мы используем данные</h2>
            <p>
              Данные используются для идентификации автора навыков и отображения профиля
              на сайте. Мы не передаём персональные данные третьим лицам.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Cookies</h2>
            <p>
              Мы используем сессионные cookies для поддержания авторизации. Никакие
              рекламные или аналитические cookies не используются.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Удаление данных</h2>
            <p>
              Вы можете запросить удаление вашего аккаунта и всех связанных данных,
              написав нам в Telegram: <a href="https://t.me/neuraldeep" className="text-accent hover:underline">@skillsbd</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Контакты</h2>
            <p>
              По вопросам конфиденциальности: <a href="https://t.me/neuraldeep" className="text-accent hover:underline">@skillsbd</a> в Telegram.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}

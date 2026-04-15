export default function CookiesPage() {
  return (
    <section className="min-h-screen bg-white pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <h1 className="text-4xl font-black text-gray-950">Cookie Policy</h1>
        <p className="text-gray-600 leading-relaxed">
          FoodHub uses cookies to keep you signed in, remember preferences, and analyze usage
          patterns for better user experience.
        </p>
        <p className="text-gray-600 leading-relaxed">
          You can control cookie behavior from your browser settings. Disabling required cookies
          may impact login, cart, and checkout functionality.
        </p>
      </div>
    </section>
  );
}

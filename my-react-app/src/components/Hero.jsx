const HomeHero = () => {
  return (
    <section className="bg-gray-50 text-center py-16 px-6 pb-12"> {/* Changed py-16 to pb-12 */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Build. Learn. Lead.
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Empowering students through code, collaboration, and real-world projects.
      </p>
      <div className="flex justify-center gap-4">
        <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300">
          Join Us
        </button>
      </div>
    </section>
  );
};

export default HomeHero;
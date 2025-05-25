import { Code, Users, BookOpen, ArrowRight, Rocket } from 'lucide-react';

const HomeHero = () => {
  return (
    <section className="bg-gradient-to-br from-gray-900 to-blue-800 text-white py-20 px-6">
  <div className="max-w-4xl mx-auto text-center">
    {/* Main Hero Content */}
    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
  Engage. Collaborate. Grow.
</h1>


    <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
      A centralized platform for college clubs to connect, share ideas, organize events, 
      and foster a stronger campus community through seamless collaboration.
    </p>
  </div>
</section>

  );
};

export default HomeHero;
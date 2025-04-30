import { Code, BrainCircuit, Trophy, BadgeCheck, Bell } from 'lucide-react';

const benefits = [
  {
    icon: <Code className="w-6 h-6 text-blue-600" />,
    title: "Access Coding Events",
    description: "Participate in hands-on coding events and challenges.",
  },
  {
    icon: <BrainCircuit className="w-6 h-6 text-blue-600" />,
    title: "Tech Workshops",
    description: "Learn latest tech skills from curated workshops and mentors.",
  },
  {
    icon: <Trophy className="w-6 h-6 text-blue-600" />,
    title: "Real Projects",
    description: "Build and showcase real-world tech projects.",
  },
  {
    icon: <BadgeCheck className="w-6 h-6 text-blue-600" />,
    title: "Earn Badges & Certificates",
    description: "Get recognized for your efforts and achievements.",
  },
  {
    icon: <Bell className="w-6 h-6 text-blue-600" />,
    title: "Push Notifications",
    description: "Receive alerts about events, deadlines, and project updates right from the website.",
  },
];

const WhyJoin = () => {
    return (
      <section className="py-16 px-6 bg-gray-50" id="why-join">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Join?</h2>
            <p className="text-gray-600">
              Discover the benefits of being a part of our student tech community.
            </p>
          </div>
          
          {/* Scrollable container with hidden scrollbar */}
          <div className="relative">
            <div className="flex overflow-x-auto pb-6 -mx-4 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex space-x-6">
                {benefits.map((item, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-64 bg-white shadow rounded-xl p-6 flex flex-col items-center text-center"
                  >
                    <div className="mb-4">{item.icon}</div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default WhyJoin;
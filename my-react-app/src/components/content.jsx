
const ClubIntroduction = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Our Club</h1>
          <p className="text-lg text-gray-600 mb-6">
            Join our vibrant community of passionate students who share common interests and goals.
            We offer exciting activities, skill-building opportunities, and a platform to connect
            with like-minded peers.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300">
            Join Now
          </button>
        </div>
        <div className="md:w-1/2">
          {/* Replace with your actual club image */}
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
            alt="Club members working together" 
            className="rounded-lg shadow-lg w-full h-auto"
          />
        </div>
      </div>

      {/* Club Objectives */}
      <div className="bg-gray-50 rounded-xl p-8 mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Our Objectives</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
            <div className="text-blue-600 text-2xl mb-3">🌟</div>
            <h3 className="font-bold text-lg mb-2">Skill Development</h3>
            <p className="text-gray-600">
              Enhance your abilities through workshops, competitions, and hands-on projects.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
            <div className="text-blue-600 text-2xl mb-3">🤝</div>
            <h3 className="font-bold text-lg mb-2">Networking</h3>
            <p className="text-gray-600">
              Connect with professionals, alumni, and peers who share your interests.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
            <div className="text-blue-600 text-2xl mb-3">🎯</div>
            <h3 className="font-bold text-lg mb-2">Community Impact</h3>
            <p className="text-gray-600">
              Make a difference through initiatives that benefit our campus and beyond.
            </p>
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Club Highlights</h2>
        
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1541178735493-479c1a27ed24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              alt="Club event" 
              className="rounded-lg shadow-md w-full h-auto"
            />
          </div>
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Recent Achievements</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Won 1st place at the Regional Competition 2023
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Organized successful charity event raising $5,000
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Featured in University Magazine for innovative projects
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Grew membership by 40% this academic year
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse gap-8">
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              alt="Upcoming events" 
              className="rounded-lg shadow-md w-full h-auto"
            />
          </div>
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-lg">Guest Speaker Series</h4>
                <p className="text-gray-600">June 15, 2023 | 4:00 PM</p>
                <p className="text-gray-700 mt-1">Industry expert sharing career insights</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-lg">Workshop: Skill Building</h4>
                <p className="text-gray-600">June 22, 2023 | 3:00 PM</p>
                <p className="text-gray-700 mt-1">Hands-on training session for members</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-lg">Annual Club Social</h4>
                <p className="text-gray-600">July 5, 2023 | 6:00 PM</p>
                <p className="text-gray-700 mt-1">Fun evening with games and networking</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership Team */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Meet Our Leadership Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((member) => (
            <div key={member} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              <img 
                src={`https://randomuser.me/api/portraits/${member % 2 === 0 ? 'women' : 'men'}/${member}0.jpg`} 
                alt={`Team member ${member}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">Member {member} Name</h3>
                <p className="text-blue-600 text-sm mb-2">Position Title</p>
                <p className="text-gray-600 text-sm">Brief description of their role</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 rounded-xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Ready to Join Our Community?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Whether you're looking to develop skills, make new friends, or contribute to meaningful projects,
          our club offers something for everyone.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-white text-blue-600 font-medium py-2 px-6 rounded-lg hover:bg-gray-100 transition duration-300">
            Sign Up Now
          </button>
          <button className="border-2 border-white text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClubIntroduction;
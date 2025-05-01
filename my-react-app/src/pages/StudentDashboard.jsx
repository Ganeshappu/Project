import { Bell, CalendarDays, BadgeCheck, BookOpen, User, ChevronRight, Award, FileText, Code, Users } from "lucide-react";

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your progress and activities</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100 w-full md:w-auto">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Welcome back</p>
              <p className="text-sm text-gray-500">Computer Science Student</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard 
            icon={<Award className="w-5 h-5" />} 
            title="Completed Courses" 
            value="12" 
            trend="+2 this month" 
            color="purple" 
          />
          <StatCard 
            icon={<BadgeCheck className="w-5 h-5" />} 
            title="Earned Badges" 
            value="8" 
            trend="New: Web Master" 
            color="yellow" 
          />
          <StatCard 
            icon={<FileText className="w-5 h-5" />} 
            title="Active Projects" 
            value="3" 
            trend="1 nearing deadline" 
            color="blue" 
          />
          <StatCard 
            icon={<Users className="w-5 h-5" />} 
            title="Study Groups" 
            value="2" 
            trend="New members joined" 
            color="green" 
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Upcoming Deadlines */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-500" />
                Upcoming Deadlines
              </h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <DeadlineItem 
                title="Machine Learning Project" 
                date="May 15, 2023" 
                daysLeft="3 days left" 
                progress={75}
                course="CS401"
              />
              <DeadlineItem 
                title="Web App Prototype" 
                date="May 22, 2023" 
                daysLeft="10 days left" 
                progress={30}
                course="CS305"
              />
              <DeadlineItem 
                title="Research Paper Draft" 
                date="June 1, 2023" 
                daysLeft="20 days left" 
                progress={10}
                course="CS410"
              />
            </div>
          </div>

          {/* Learning Resources */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                Recommended Resources
              </h2>
              <button className="text-sm text-emerald-600 hover:text-emerald-800 flex items-center">
                Browse all <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <ResourceItem 
                title="Advanced React Patterns" 
                type="Video Course" 
                duration="8h 45m" 
                progress={65}
                icon={<Code className="w-4 h-4" />}
              />
              <ResourceItem 
                title="Database Optimization" 
                type="E-book" 
                duration="120 pages" 
                progress={40}
                icon={<FileText className="w-4 h-4" />}
              />
              <ResourceItem 
                title="UI/UX Fundamentals" 
                type="Interactive Tutorial" 
                duration="5 modules" 
                progress={20}
                icon={<Users className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Recent Achievements
              </h2>
              <button className="text-sm text-amber-600 hover:text-amber-800 flex items-center">
                See all <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <AchievementItem 
                title="Top Performer" 
                description="Ranked in top 5% of Machine Learning course" 
                date="May 5, 2023"
                badgeColor="bg-purple-100 text-purple-800"
              />
              <AchievementItem 
                title="Project Excellence" 
                description="Web App prototype received faculty commendation" 
                date="Apr 28, 2023"
                badgeColor="bg-blue-100 text-blue-800"
              />
              <AchievementItem 
                title="Peer Mentor" 
                description="Recognized for helping classmates with React concepts" 
                date="Apr 15, 2023"
                badgeColor="bg-green-100 text-green-800"
              />
            </div>
          </div>

          {/* Notifications Panel - Full Width */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5 text-rose-500" />
                Notifications
              </h2>
              <button className="text-sm text-rose-600 hover:text-rose-800 flex items-center">
                Mark all as read <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <NotificationCard 
                type="academic" 
                title="New Assignment Posted" 
                content="CS401: Final project requirements have been updated" 
                time="2 hours ago"
              />
              <NotificationCard 
                type="event" 
                title="Workshop Reminder" 
                content="API Development workshop starts tomorrow at 2 PM" 
                time="1 day ago"
              />
              <NotificationCard 
                type="system" 
                title="Profile Update Required" 
                content="Please verify your contact information" 
                time="3 days ago"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// Reusable Components
const StatCard = ({ icon, title, value, trend, color }) => {
  const colors = {
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-amber-100 text-amber-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-emerald-100 text-emerald-600'
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-gray-500">{trend}</p>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-gray-700">{title}</p>
    </div>
  );
};

const DeadlineItem = ({ title, date, daysLeft, progress, course }) => (
  <div className="border-l-2 border-indigo-200 pl-3">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-xs text-gray-500">{course} • Due {date}</p>
      </div>
      <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full">{daysLeft}</span>
    </div>
    <div className="mt-2">
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div 
          className="bg-indigo-600 h-1.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-right text-xs text-gray-500 mt-1">{progress}% complete</p>
    </div>
  </div>
);


const ResourceItem = ({ title, type, duration, progress, icon }) => (
  <div className="p-3 hover:bg-gray-50 rounded-lg transition">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-xs text-gray-500">{type} • {duration}</p>
        <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
          <div 
            className="bg-emerald-500 h-1.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <button className="text-emerald-500 hover:text-emerald-700">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const AchievementItem = ({ title, description, date, badgeColor }) => (
  <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
    <div className={`px-2 py-1 text-xs rounded-full ${badgeColor}`}>
      {title}
    </div>
    <div className="flex-1">
      <p className="text-sm">{description}</p>
      <p className="text-xs text-gray-500 mt-1">{date}</p>
    </div>
  </div>
);

const NotificationCard = ({ type, title, content, time }) => {
  const typeStyles = {
    academic: 'bg-blue-50 text-blue-800',
    event: 'bg-purple-50 text-purple-800',
    system: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="p-4 border border-gray-100 rounded-lg hover:shadow-sm transition">
      <span className={`text-xs px-2 py-1 rounded-full ${typeStyles[type]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
      <h3 className="font-medium mt-2">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{content}</p>
      <p className="text-xs text-gray-400 mt-2">{time}</p>
    </div>
  );
};

export default StudentDashboard;
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, Calendar, Bell, Users, Settings, Mail, Award } from 'lucide-react';

const StudentFAQ = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleCategory = (index) => {
    setActiveCategory(activeCategory === index ? null : index);
  };

  const faqs = [
    {
      category: "Announcements",
      icon: <Bell className="w-5 h-5" />,
      questions: [
        {
          question: "How will I receive announcements?",
          answer: "Announcements appear on your dashboard homepage and are also sent to your registered email address. Make sure your email is up to date in your profile."
        },
        {
          question: "What types of announcements will I receive?",
          answer: "You'll receive announcements about upcoming events, voting opportunities, important deadlines, policy changes, and other relevant student information."
        }
      ]
    },
    {
      category: "Events & Registration",
      icon: <Calendar className="w-5 h-5" />,
      questions: [
        {
          question: "How do I register for events?",
          answer: "Browse available events on your dashboard, click on the event you're interested in, and follow the registration process. You'll receive a confirmation email once registered."
        },
        {
          question: "Will I receive reminders about registered events?",
          answer: "Yes, you'll receive email reminders and dashboard notifications about upcoming events you've registered for, usually 24-48 hours before the event."
        }
      ]
    },
    {
      category: "Chat & Communication",
      icon: <MessageCircle className="w-5 h-5" />,
      questions: [
        {
          question: "How can I chat with other students?",
          answer: "Use the chat feature in your dashboard to communicate with other students. You can join group chats for events you're registered for or send direct messages to other participants."
        },
        {
          question: "Are chat messages monitored?",
          answer: "Chat messages are monitored to ensure they follow community guidelines. Please keep conversations respectful and appropriate. Report any inappropriate behavior to administrators."
        }
      ]
    },
    {
      category: "Certificates",
      icon: <Award className="w-5 h-5" />,
      questions: [
        {
          question: "Do I get a certificate for participating in events?",
          answer: "Yes! You will receive a digital certificate for each event you successfully participate in. Certificates are automatically generated and sent to your email after event completion."
        },
        {
          question: "How do I download my certificates?",
          answer: "Go to the 'My Certificates' section in your dashboard. You can view, download, and print all your earned certificates. They're available in PDF format."
        },
        {
          question: "What information is included in the certificate?",
          answer: "Certificates include your name, the event title, participation date, event duration, and are digitally signed by the institution. Some may include additional details like your performance or completion status."
        },
      ]
    },
    {
      category: "Feedback",
      icon: <Bell className="w-5 h-5" />,
      questions: [
        {
          question: "How can I provide feedback?",
          answer: "Use the feedback section on your dashboard to share your thoughts about events, the system, or suggest improvements. Your feedback helps us improve the platform."
        },
        {
          question: "Will I get a response to my feedback?",
          answer: "While we read all feedback, responses depend on the type of feedback. General suggestions may be addressed in announcements, while specific issues may receive individual responses."
        }
      ]
    },
    {
      category: "Email & Notifications",
      icon: <Mail className="w-5 h-5" />,
      questions: [
        {
          question: "Why am I not receiving emails?",
          answer: "Check your spam/junk folder first. Ensure your email address is correct in your profile. You can also check your notification preferences in settings."
        },
        {
          question: "How often will I receive emails?",
          answer: "Email frequency depends on activities and announcements. You'll typically receive emails for new announcements, event reminders, and voting notifications."
        }
      ]
    },
  ];

  return (
<div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl border border-slate-200 shadow-md">
      <div className="mb-8">
        {/* Main title - change text-3xl to adjust size (e.g., text-4xl for larger) */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        {/* Subtitle - change text-gray-600 to text-sm/text-base/text-lg etc. */}
        <p className="text-gray-600 text-base">Find answers to common questions about using your student dashboard</p>
      </div>

      <div className="space-y-4">
        {faqs.map((category, categoryIndex) => (
          <div key={categoryIndex} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleCategory(categoryIndex)}
              className="w-full bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="text-blue-600">
                  {category.icon}
                </div>
                {/* Category title - change text-lg to adjust size */}
                <h3 className="text-lg font-semibold text-gray-900 text-am">{category.category}</h3>
              </div>
              <div className="flex-shrink-0">
                {activeCategory === categoryIndex ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </button>
            
            {activeCategory === categoryIndex && (
              <div className="divide-y divide-gray-200">
                {category.questions.map((faq, questionIndex) => (
                  <div key={questionIndex} className="px-6 py-4">
                    {/* Question text - change font-medium to font-bold and/or add text size class */}
                    <h4 className="font-medium text-gray-900 text-base mb-2">{faq.question}</h4>
                    {/* Answer text - change text-gray-700 to text-sm/text-base etc. */}
                    <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentFAQ;
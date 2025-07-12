import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Send, Smile, MoreVertical, Phone, Video } from 'lucide-react';
import { db, auth } from '../Firebase/firebase.jsx'; // Adjust the import path as needed

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user] = useAuthState(auth);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;

    setIsTyping(true);
    
    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        timestamp: serverTimestamp(),
        uid: user.uid,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL || ''
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
<div className="flex items-start justify-center min-h-screen bg-gray-100 pt-7">

<div className="flex flex-col w-[900px] h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 shadow-2xl rounded-2xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
              {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Group Chat</h3>
            <p className="text-xs text-slate-500">{messages.length} messages</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <Phone className="w-5 h-5 text-slate-600" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <Video className="w-5 h-5 text-slate-600" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.uid === user.uid;
          const showAvatar = !isCurrentUser && (index === 0 || messages[index - 1].uid !== message.uid);
          
          return (
            <div 
              key={message.id}
              className={`flex items-end space-x-2 transition-all duration-300 ease-in-out ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isCurrentUser && (
                <div className="w-8 h-8 flex-shrink-0">
                  {showAvatar && (
                    <div className="w-8 h-8 rounded-full overflow-hidden shadow-md">
                      {message.photoURL ? (
                        <img 
                          src={message.photoURL} 
                          alt={message.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                          {message.displayName?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-first' : ''}`}>
                {!isCurrentUser && showAvatar && (
                  <div className="text-xs text-slate-500 mb-1 ml-3">
                    {message.displayName}
                  </div>
                )}
                
                <div className={`group relative px-4 py-3 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg transform hover:scale-105 ${
                  isCurrentUser 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ml-auto' 
                    : 'bg-white text-slate-800 border border-slate-200'
                }`}>
                  <div className="break-words">{message.text}</div>
                  <div className={`text-xs mt-1 opacity-70 ${isCurrentUser ? 'text-blue-100' : 'text-slate-500'}`}>
                    {formatTime(message.timestamp)}
                  </div>
                  
                  {/* Message tail */}
                  <div className={`absolute w-3 h-3 transform rotate-45 ${
                    isCurrentUser 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 -right-1 bottom-3' 
                      : 'bg-white border-l border-b border-slate-200 -left-1 bottom-3'
                  }`}></div>
                </div>
              </div>
              
              {isCurrentUser && (
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                    {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {isTyping && (
          <div className="flex items-center space-x-2 animate-pulse">
            <div className="w-8 h-8 bg-slate-300 rounded-full"></div>
            <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t border-slate-200 p-4 bg-white/80 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <Smile className="w-5 h-5 text-slate-600" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full bg-slate-100 border border-slate-200 rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 placeholder-slate-500 transition-all duration-200"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={newMessage.trim() === '' || isTyping}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-200 ${
                newMessage.trim() === '' || isTyping
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ChatBox;
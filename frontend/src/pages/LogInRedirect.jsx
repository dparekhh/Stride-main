import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LogInRedirect = () => {
  const navigate = useNavigate();

  // Redirect to login page after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Account successfully setup!
        </h1>
        
        <div className="mb-8 relative">
          {/* Green success circle with checkmark */}
          <div className="inline-block">
            <motion.div
              className="h-20 w-20 bg-green-500 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20, 
                delay: 0.2 
              }}
            >
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-10 w-10 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <motion.path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7" 
                />
              </motion.svg>
            </motion.div>
          </div>
          
          {/* Confetti elements */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute h-2 w-2 rounded-full`}
              style={{
                backgroundColor: [
                  '#FF5A1F', // Stride orange
                  '#FCD34D', // Yellow
                  '#34D399', // Green
                  '#60A5FA', // Blue
                ][i % 4],
                top: '50%',
                left: '50%',
              }}
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 0,
                scale: 0 
              }}
              animate={{ 
                x: Math.sin(i * 30 * (Math.PI / 180)) * (i % 2 ? 70 : 40), 
                y: Math.cos(i * 30 * (Math.PI / 180)) * (i % 2 ? 70 : 40), 
                opacity: [0, 1, 0],
                scale: [0, 1, 0] 
              }}
              transition={{ 
                duration: 1.5, 
                delay: 0.2 + (i * 0.05),
                repeat: 1,
                repeatType: "mirror"
              }}
            />
          ))}
        </div>
        
        <p className="text-gray-500">
          Redirecting to login page
        </p>
      </div>
    </div>
  );
};

export default LogInRedirect;
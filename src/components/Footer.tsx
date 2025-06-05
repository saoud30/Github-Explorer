import React from 'react';
import { Github, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white/60 backdrop-blur-sm py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">© 2023 GitHub Explorer. All rights reserved.</p>
          </div>

          <div className="flex items-center mb-4 md:mb-0">
            <Heart className="h-4 w-4 text-purple-500 mr-1" />
            <p className="text-gray-600 text-sm">Made with <span className="text-purple-600">💜</span> by SHAZY</p>
          </div>

          <div className="flex space-x-4">
            <a
              href="https://github.com/saoud30"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>

            <a
              href="https://www.linkedin.com/in/mohd-saoud30"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;

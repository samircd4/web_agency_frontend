import React from 'react';
import Image from 'next/image';
import { Globe, Send, MessageSquare, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0b1120] border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-8 h-8">
                <Image 
                    src="/images/logo/logo.png" 
                    alt="Dr. Python Solutions" 
                    fill 
                    className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-white">
                Dr. <span className="text-blue-500">Python</span> Solutions
              </span>
            </div>
            <p className="text-gray-500 max-w-sm mb-6">
              Expert Python solutions for modern businesses. Specializing in high-scale data extraction and custom e-commerce engines.
            </p>
            <div className="flex gap-4">
              <a title="GitHub" href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors text-white"><Globe size={18}/></a>
              <a title="LinkedIn" href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors text-white"><MessageSquare size={18}/></a>
              <a title="Contact" href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors text-white"><Send size={18}/></a>
              <a title="Mail" href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors text-white"><Mail size={18}/></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white">Services</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Web Scraping</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Custom Dashboards</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">E-commerce Engines</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">API Automation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white">Company</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Our Works</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-gray-600 text-xs">
          © 2026 Dr. Python Solutions. All rights reserved. Dhaka, Bangladesh.
        </div>
      </div>
    </footer>
  );
}
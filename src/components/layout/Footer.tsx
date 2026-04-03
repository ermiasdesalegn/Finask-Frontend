import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import finaskLogo from "../../assets/finask-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-blue rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-yellow rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <Link to="/" className="inline-block mb-6">
                <img src={finaskLogo} alt="Finask Logo" className="h-10 w-auto object-contain" />
              </Link>
              <p className="text-slate-400 mb-6 leading-relaxed max-w-sm">
                Empowering Ethiopian students with AI-driven insights to navigate their academic future with confidence. Your trusted guide to higher education.
              </p>
              
              {/* Social Media Icons */}
              <div className="flex items-center gap-3">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-brand-blue rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-brand-blue/50"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-brand-blue rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-brand-blue/50"
                  aria-label="Twitter"
                >
                  <Twitter size={18} />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-brand-blue rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-brand-blue/50"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-brand-blue rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-brand-blue/50"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-brand-blue rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-brand-blue/50"
                  aria-label="YouTube"
                >
                  <Youtube size={18} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="font-bold text-lg mb-6 text-white">Explore</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/universities" className="text-slate-400 hover:text-white transition-colors inline-flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-brand-blue transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
                    Universities
                  </Link>
                </li>
                <li>
                  <Link to="/programs" className="text-slate-400 hover:text-white transition-colors inline-flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-brand-blue transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
                    Programs
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors inline-flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-brand-blue transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
                    Scholarships
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors inline-flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-brand-blue transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
                    Admissions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors inline-flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-brand-blue transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
                    Rankings
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="lg:col-span-2">
              <h4 className="font-bold text-lg mb-6 text-white">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-slate-400 hover:text-white transition-colors inline-flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-brand-blue transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
                    About Us
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors inline-flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-brand-blue transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors inline-flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-brand-blue transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
                    Career Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors inline-flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-brand-blue transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors inline-flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-brand-blue transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="lg:col-span-2">
              <h4 className="font-bold text-lg mb-6 text-white">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors inline-flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-brand-blue transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors inline-flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-brand-blue transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors inline-flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-brand-blue transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors inline-flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-brand-blue transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h4 className="font-bold text-lg mb-6 text-white">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-400">
                  <MapPin size={18} className="text-brand-blue mt-0.5 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">
                    Addis Ababa, Ethiopia
                  </span>
                </li>
                <li className="flex items-start gap-3 text-slate-400">
                  <Mail size={18} className="text-brand-blue mt-0.5 flex-shrink-0" />
                  <a href="mailto:info@finask.com" className="text-sm hover:text-white transition-colors">
                    info@finask.com
                  </a>
                </li>
                <li className="flex items-start gap-3 text-slate-400">
                  <Phone size={18} className="text-brand-blue mt-0.5 flex-shrink-0" />
                  <a href="tel:+251911234567" className="text-sm hover:text-white transition-colors">
                    +251 911 234 567
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-slate-500 text-sm text-center md:text-left">
                © {currentYear} Finask. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm font-semibold">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Sitemap
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Accessibility
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Status
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

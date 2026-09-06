import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Star,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-black overflow-hidden"
    >
      {/* Animated background sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-10 right-1/3 w-1 h-1 bg-green-400 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          {/* Company Info */}
          <div className="text-center lg:text-left mb-12">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <img
                src="./logo.png"
                alt="Selvaganapathy Traders Logo"
                className="h-14 w-14 object-contain m-0 p-0"
              />
              <h2 className="text-xl font-bold text-white m-0 p-0">
                SELVAGANAPATHY TRADERS
              </h2>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed max-w-3xl mx-auto lg:mx-0">
              We specialize in premium quality fireworks, crackers, and
              celebration essentials for all your festive occasions. Licensed
              dealer with international safety standards.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center text-gray-300 justify-center lg:justify-start">
                <MapPin className="w-5 h-5 mr-3 text-red-400 flex-shrink-0" />
                <span>
                  Main Road, Kananjampatti, Sivakasi-Vembakkottai Road, Tamil
                  Nadu
                </span>
              </div>
              <div className="flex items-center text-gray-300 justify-center lg:justify-start">
                <Phone className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                <a href="tel:+919944087728" className="hover:underline">
                  +91 99440 87728
                </a>
              </div>
              <div className="flex items-center text-gray-300 justify-center lg:justify-start">
                <Mail className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0" />
                <a
                  href="mailto:selvaganapathytraders.official@gmail.com"
                  className="hover:underline"
                >
                  selvaganapathytraders.official@gmail.com
                </a>
              </div>

              <div className="flex items-center text-gray-300 justify-center lg:justify-start">
                <Clock className="w-5 h-5 mr-3 text-yellow-400 flex-shrink-0" />
                <span>Mon-Sat: 9AM-8PM | Sun: 10AM-6PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Map Section */}
        <div className="py-8 border-t border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Visit Our Store
              </h3>
              <img
                className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                src="./Location_Pic.jpg"
                alt="SELVAGANAPATHY TRADERS Store Front"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Find Us Here
              </h3>
              <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
                <iframe
                  title="Selvaganapathy Traders Location"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d774.0211781897963!2d77.7807148!3d9.3559534!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06c900012e23cf%3A0x765074c6264e55cd!2sSELVA%20GANAPATHY%20TRADERS!5e1!3m2!1sen!2sin!4v1753207962124!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-gray-400 text-sm">
              <p>© 2025 Selvaganapathy Traders. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* Safety Banner */}
        <div className="pb-6">
          <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border border-red-500/30 rounded-lg p-4 text-center">
            <p className="text-yellow-200 text-sm">
              ⚠️ <strong>Safety First:</strong> Always follow fireworks safety
              guidelines. Keep water nearby. Adult supervision required.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

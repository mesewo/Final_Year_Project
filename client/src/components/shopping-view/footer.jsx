import React from "react";

function ShoppingFooter() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Abay Garment</h2>
          <p className="text-sm mb-2">
            We are a leading garment factory based in Gondar, Ethiopia.
          </p>
          <p className="text-sm">
            Kebele 17, Industrial Zone, Gondar, Ethiopia
          </p>
          <p className="text-sm">Phone: +251 588129431</p>
          <p className="text-sm">Email: abaygarment2019@gmail.com</p>
        </div>

        {/* Business Hours & Social */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
          <p className="text-sm mb-2">Mon–Sat: 8:00 AM – 5:00 PM</p>
          <h2 className="text-xl font-semibold mt-6 mb-4">Follow Us</h2>
          <div className="flex flex-col items-start gap-3">
            {/* Facebook Icon Link */}
            <a
              href="https://web.facebook.com/p/Abay-Garment-Company-Gondar-100064149995812/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-500 transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.406.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
              </svg>
            </a>
            {/* Telegram Icon Link */}
            <a
              href="https://t.me/abaygarmentverified"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-500 transition-colors"
              aria-label="Telegram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.05 2.927a2.25 2.25 0 0 0-2.2-.287L3.7 8.34c-1.09.43-1.08 1.7-.18 2.01l3.44 1.13 1.32 4.17c.23.73.92 1.13 1.6.89l2.13-.77 2.13 1.57c.61.45 1.45.13 1.67-.61l3.13-10.13c.22-.74-.18-1.52-.93-1.75zm-2.13 2.13-3.13 10.13-2.13-1.57-2.13.77-1.32-4.17-3.44-1.13 15.15-5.83z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Google Map */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Our Location</h2>
          <div className="w-full h-48">
            <iframe
              title="Abay Garment Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.180184308353!2d37.470000000000006!3d12.600000000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1643f0b0a0b0a0b0%3A0x123456789abcdef!2sAbay%20Garment%20Factory!5e0!3m2!1sen!2set!4v1620000000000!5m2!1sen!2set"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Abay Garment. All rights reserved.
      </div>
    </footer>
  );
}

export default ShoppingFooter;

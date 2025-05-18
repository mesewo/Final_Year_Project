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
          <p className="text-sm">Kebele 17, Industrial Zone, Gondar, Ethiopia</p>
          <p className="text-sm">Phone: +251 588129431</p>
          <p className="text-sm">Email: abaygarment2019@gmail.com</p>
        </div>

        {/* Business Hours & Social */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
          <p className="text-sm mb-2">Mon–Sat: 8:00 AM – 5:00 PM</p>
          <h2 className="text-xl font-semibold mt-6 mb-4">Follow Us</h2>
          <a
            href="https://web.facebook.com/p/Abay-Garment-Company-Gondar-100064149995812/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:underline"
          >
            Facebook
          </a>
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

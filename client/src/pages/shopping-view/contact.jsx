import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We'd love to hear from you! Reach out for inquiries, support, or wholesale opportunities.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: <FaMapMarkerAlt className="text-2xl" />,
                title: "Our Location",
                content: " Gondar Azezo, Ethiopia",
                link: "https://maps.google.com",
                linkText: "View on Map"
              },
              {
                icon: <FaPhone className="text-2xl" />,
                title: "Call Us",
                content: "+251 911 234 567",
                link: "tel:+251911234567",
                linkText: "Call Now"
              },
              {
                icon: <FaEnvelope className="text-2xl" />,
                title: "Email Us",
                content: "info@abaygarment.com",
                link: "mailto:info@abaygarment.com",
                linkText: "Send Email"
              },
              {
                icon: <FaClock className="text-2xl" />,
                title: "Working Hours",
                content: "Mon-Fri: 9AM - 6PM\nSat: 10AM - 4PM",
                link: "",
                linkText: ""
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4 whitespace-pre-line">{item.content}</p>
                {item.link && (
                  <a 
                    href={item.link} 
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {item.linkText}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Contact Form + Map */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="What's this about?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.923516372083!2d38.7639493153571!3d8.980980193549082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85f882e5e7c3%3A0x2007d8a6a2a2a2a2!2sBole%20Road%2C%20Addis%20Ababa!5e0!3m2!1sen!2set!4v1620000000000!5m2!1sen!2set"
                width="100%"
                height="100%"
                style={{ minHeight: "400px", border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  question: "How long does shipping take?",
                  answer: "Domestic orders typically arrive in 2-3 business days. International shipping takes 7-14 business days depending on destination."
                },
                {
                  question: "Do you offer custom sizing?",
                  answer: "Yes! We can customize any garment to your measurements. Please allow an additional 3-5 business days for custom orders."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, PayPal, and Ethiopian mobile payment options like Telebirr and CBE Birr."
                },
                {
                  question: "How do I care for my abay garment?",
                  answer: "We recommend hand washing in cold water with mild detergent. Lay flat to dry and iron on low heat if needed."
                }
              ].map((item, index) => (
                <div key={index} className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
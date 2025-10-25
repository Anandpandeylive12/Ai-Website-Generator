"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "../_component/Header";
import Image from "next/image";

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! We received your message.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-24 px-4 md:px-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Contact Us
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
          Have questions or feedback? We’d love to hear from you.
        </p>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4 md:px-12 flex justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={6}
              required
            ></textarea>
            <Button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-700 text-lg py-4">
              Send Message
            </Button>
          </form>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 px-4 md:px-12 max-w-5xl mx-auto grid md:grid-cols-3 gap-12 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <Image src="/email-svgrepo-com.svg" width={50} height={50} alt="Email" className="mx-auto mb-4"/>
          <h3 className="text-xl font-semibold mb-2">Email Us</h3>
          <p className="text-gray-600">support@aiwebsite.com</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <Image src="/call-chat-rounded-svgrepo-com.svg" width={50} height={50} alt="Phone" className="mx-auto mb-4"/>
          <h3 className="text-xl font-semibold mb-2">Call Us</h3>
          <p className="text-gray-600">+91 (123) 456-7890</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <Image src="/location-arrow-svgrepo-com.svg" width={50} height={50} alt="Location" className="mx-auto mb-4"/>
          <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
          <p className="text-gray-600">New Delhi</p>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-20 px-4 md:px-12">
        <h2 className="text-4xl font-bold text-center mb-8">Our Location</h2>
        <div className="w-full h-96 bg-gray-200 rounded-2xl flex items-center justify-center">
          <p className="text-gray-500">[Map Placeholder]</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-12 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Have a project in mind?
        </h2>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Reach out to us and let's bring your website ideas to life with AI.
        </p>
        <Button className="bg-indigo-600 text-white hover:bg-indigo-700 text-lg py-4 px-8">
          Get Started
        </Button>
      </section>
    </div>
  );
};

export default ContactUs;

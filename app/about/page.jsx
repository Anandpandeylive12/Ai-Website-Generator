"use client";

import Image from "next/image";
import Header from "../_component/Header";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "AI-Powered Design",
    description:
      "Generate professional websites instantly with AI assistance. No coding required.",
    icon: "/ai-svgrepo-com.svg",
  },
  {
    title: "Responsive Templates",
    description:
      "All websites are fully responsive, mobile-friendly, and SEO optimized.",
    icon: "/responsive-svgrepo-com.svg",
  },
  {
    title: "Fast & Intuitive",
    description:
      "Create websites in minutes with an easy-to-use interface and drag & drop features.",
    icon: "/fast-svgrepo-com.svg",
  },
  {
    title: "Affordable Plans",
    description:
      "Choose the plan that fits your needs without breaking the bank.",
    icon: "/dollar-minimalistic-svgrepo-com.svg",
  },
];

const testimonials = [
  {
    name: "Jane Doe",
    role: "Founder, StartupX",
    message:
      "AI Website Generator completely transformed our website building process. It's fast, reliable, and professional.",
  },
  {
    name: "John Smith",
    role: "Designer, Creatives Inc.",
    message:
      "I love how intuitive and powerful this tool is. It saves so much time and produces amazing designs.",
  },
];

const About = () => {
  return (
    <div className="bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-24 px-4 md:px-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          About AI Website Generator
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
          AI Website Generator empowers anyone to create beautiful, professional websites effortlessly.
        </p>
        <Button className="bg-white text-indigo-600 hover:bg-gray-100">
          Get Started Today
        </Button>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-12 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Why Choose Us?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <Image
                src={feature.icon}
                alt={feature.title}
                width={60}
                height={60}
                className="mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Illustration + Description */}
      <section className="py-20 px-4 md:px-12 flex flex-col md:flex-row items-center gap-12 max-w-7xl mx-auto">
        <div className="md:w-1/2">
          <Image
            src="/illustration-of-a-long-tail-graph-svgrepo-com.svg"
            alt="About illustration"
            width={600}
            height={400}
          />
        </div>
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-3xl font-bold">Simplify Web Design</h2>
          <p className="text-gray-700 text-lg">
            Our AI Website Generator makes web development easy and accessible for everyone. 
            Focus on your ideas while we handle the design, responsiveness, and layout.
          </p>
          <p className="text-gray-700 text-lg">
            Whether you are a freelancer, startup, or enterprise, our platform adapts to your needs and helps you build stunning websites quickly.
          </p>
          <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
            Try It Now
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 md:px-12 bg-gray-100">
        <h2 className="text-4xl font-bold text-center mb-12">
          What Our Users Say
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <p className="text-gray-700 mb-4">"{t.message}"</p>
              <h4 className="font-semibold">{t.name}</h4>
              <p className="text-gray-500 text-sm">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="py-20 px-4 md:px-12 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to build your website with AI?
        </h2>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Join thousands of users who are creating stunning websites effortlessly with AI Website Generator.
        </p>
        
        <Button className="bg-indigo-600 text-white hover:bg-indigo-700 text-lg py-4 px-8">
          Get Started
        </Button>
      </section>
    </div>
  );
};

export default About;

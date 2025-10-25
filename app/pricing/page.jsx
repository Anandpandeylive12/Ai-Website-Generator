"use client";

import { Button } from "@/components/ui/button";
import Header from "../_component/Header";

const plans = [
  {
    name: "Basic",
    price: "$0",
    description: "Ideal for personal projects",
    features: ["1 Project", "Basic Templates", "Community Support"],
    popular: false,
  },
  {
    name: "Pro",
    price: "$10/mo",
    description: "Perfect for freelancers and small teams",
    features: ["10 Projects", "Premium Templates", "Priority Support"],
    popular: true, // Highlight this plan
  },
  {
    name: "Enterprise",
    price: "$50/mo",
    description: "For large teams and enterprises",
    features: ["Unlimited Projects", "Custom Templates", "Dedicated Support"],
    popular: false,
  },
];

const Pricing = () => {
  return (
    <div className="bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-24 px-4 md:px-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Pricing Plans
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
          Choose a plan that fits your needs and start creating stunning websites with AI.
        </p>
        <Button className="bg-white text-indigo-600 hover:bg-gray-100">
          Get Started
        </Button>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative bg-white rounded-2xl p-8 flex flex-col items-center shadow-lg hover:shadow-xl transform transition hover:-translate-y-1 ${
                plan.popular ? "border-4 border-indigo-600" : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute top-0 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              )}
              <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
              <p className="text-gray-500 mb-4">{plan.description}</p>
              <p className="text-3xl font-bold mb-6">{plan.price}</p>
              <ul className="mb-6 space-y-2 text-gray-600">
                {plan.features.map((feature, i) => (
                  <li key={i}>• {feature}</li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.popular ? "bg-indigo-600 text-white hover:bg-indigo-700" : ""
                }`}
              >
                Choose Plan
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="py-20 px-4 md:px-12 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to start building with AI?
        </h2>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Join thousands of users creating beautiful websites effortlessly with AI Website Generator.
        </p>
        <Button className="bg-indigo-600 text-white hover:bg-indigo-700 text-lg py-4 px-8">
          Get Started Now
        </Button>
      </section>
    </div>
  );
};

export default Pricing;

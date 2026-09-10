// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { Sprout, MessageCircle, Camera, CloudSun } from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Ask Anything",
    desc: "Type or speak your farming question and get instant AI-backed advice.",
  },
  {
    icon: Camera,
    title: "Detect Crop Disease",
    desc: "Upload a photo of your crop and identify diseases early.",
  },
  {
    icon: CloudSun,
    title: "Weather & Advisory",
    desc: "Get localized weather updates and crop-specific recommendations.",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-green-50">
      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-4 pt-20 pb-16">
        <div className="flex justify-center mb-4">
          <Sprout size={48} className="text-green-700" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          AI-Powered Support for Every Farmer
        </h1>
        <p className="text-gray-600 mb-8">
          Ask questions, detect crop diseases, and get personalized advisory —
          in your language, on your schedule.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="bg-green-700 text-white px-6 py-3 rounded-md font-medium hover:bg-green-800"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="border border-green-700 text-green-700 px-6 py-3 rounded-md font-medium hover:bg-green-100"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pb-20">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-lg shadow p-6 text-center">
            <Icon size={32} className="text-green-700 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
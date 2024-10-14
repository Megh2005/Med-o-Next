"use client";

import Link from "next/link";

  export default function Features() {
    return (
      <section id="features" className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-100 p-6 rounded-lg shadow-md hover:scale-105 hover:bg-blue-300 transition ease-in-out delay-150 cursor-pointer">
              <Link href={"/healthNews"} className=" hover:text-emerald-500  text-xl font-bold mb-2">Trending Health News</Link>
              <p className="text-sm text-gray-600">
                Stay updated with the latest news and medical breakthroughs.
              </p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg shadow-md  hover:scale-105 hover:bg-blue-300 transition ease-in-out delay-150 cursor-pointer">
              <h3 className="text-xl font-bold mb-2">Expert Advice</h3>
              <p className="text-sm text-gray-600">
                Get guidance from certified health professionals.
              </p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg shadow-md hover:scale-105 hover:bg-blue-300 transition ease-in-out delay-150 cursor-pointer">
              <h3 className="hover:text-emerald-500 text-xl font-bold mb-2">Personalized Feed</h3>
              <p className="text-sm text-gray-600">
                Customize your news feed based on your interests.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
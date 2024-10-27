import Features from '../components/Features';
import Services from '../components/Services';
import UserInterests from '../components/UserInterests';

export default function Home() {
  return (
    <>
      <main className="bg-blue-50 text-black">
        <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-600 to-blue-400 text-white py-16 px-6">
          <h1 className="text-5xl font-bold text-center mb-6">Stay Informed with Med-o-Media</h1>
          <p className="text-lg text-center max-w-2xl">
            Your one-stop destination for the latest health news, trends, and expert advice.
          </p>
        </section>
        <Features />
        <Services />
        <UserInterests />
      </main>
    </>
  );
}


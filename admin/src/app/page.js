
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHomeUser, faUserShield } from "@fortawesome/free-solid-svg-icons";

export default function Home() {

  return (
   <>
   <main className="bg-blue-50 text-black">
        <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-600 to-blue-400 text-white py-16 px-6">
          <h1 className="text-5xl font-bold text-center mb-6"> Med-o-Media: Admin Dashboard</h1>
          <p className="text-lg text-center max-w-2xl">
             One-stop destination for the latest health news, trends, and expert advice.
          </p>
          <ul className="flex space-x-6 mt-4">
          <Link
            href="/authGuard"
            className="bg-yellow-500 rounded-full text-white font-semibold py-2 px-4  shadow-lg hover:bg-emerald-400 transition duration-300 ease-in-out items-center  justify-between"
          >
            Admin Login <FontAwesomeIcon icon={faUserShield} />
          </Link>
          <Link
            href="https://med-o-media.vercel.app/"
            className="bg-yellow-500 rounded-full text-white font-semibold py-2 px-4  shadow-lg hover:bg-emerald-400 transition duration-300 ease-in-out items-center  justify-between"
          >
            HomePage <FontAwesomeIcon icon={faHomeUser} /> 
          </Link>
          </ul>
        </section>
      </main>
   </>
  );
}

import {
  faListAlt,
  faSave,
  faUsersViewfinder,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-full md:w-64 bg-gray-100 min-h-screen flex flex-col space-y-4 py-4 my-4 border-4 border-r-indigo-500 bg-blue-500 shadow-lg shadow-blue-500/50">
      <div className="flex flex-col space-y-6 ">
        <Link
          href="/articlesList"
          className="flex items-center space-x-3 hover:bg-green-500 hover:text-white transition duration-300 p-2 rounded-lg"
        >
          <span className="w-6 h-6">
            <FontAwesomeIcon icon={faListAlt} />
          </span>
          <p className="text-lg font-medium">Articles List</p>
        </Link>

        <Link
          href="/saveFeeds"
          className="flex items-center space-x-3 hover:bg-green-500 hover:text-white transition duration-300 p-2 rounded-lg"
        >
          <span className="w-6 h-6">
            <FontAwesomeIcon icon={faSave} />
          </span>
          <p className="text-lg font-medium">Save Articles</p>
        </Link>
      </div>
    </div>
  );
}

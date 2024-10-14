"use client"
import { faMailBulk, faSpinner, faUserLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link"
import { useEffect, useState } from 'react';

export default function Login(){

  const[loading, setLoading]=useState(false);

    const[inp, setInp]=useState({
    email:" ",
    password:" ",
  })

  const handleChange=(e)=>{
    const name=e.target.name;
    const value=e.target.value;
    setInp((data) => ({...data, [name]: value}))
  }

  const onSubmit=(e)=>{
    e.preventDefault();
  }



  return (
    <div className="fixed inset-0 z-99 flex min-h-[100dvh] justify-center items-center bg-background px-4 py-12 sm:px-6 lg:px-8">
<div className="w-full max-w-md space-y-4 rounded-lg bg-background p-6 shadow-lg">
  <h2 className="text-2xl font-bold">Sign in to your account</h2>
 
    <form onSubmit={onSubmit} className="space-y-8">
      <div>
    <label htmlFor="email">
              <FontAwesomeIcon icon={faMailBulk} /> Email
            </label>
            <input
              type="email"
              name="email"
              value={inp.email}
              placeholder="Enter your email"
              onChange={handleChange}
            />
            </div>
       <div>
            <label htmlFor="password">
              <FontAwesomeIcon icon={faUserLock} /> Password
            </label>
            <input
              type="password"
              name="password"
              value={inp.password}
              placeholder="Enter your password"
              onChange={handleChange}
            />
          </div>
          <button type="submit">
            {loading ? <FontAwesomeIcon icon={faSpinner} spinPulse /> : "Submit"}
          </button>
    </form>
 
  <p className="text-muted-foreground">
    New to Med-o-Next?{" "}
    <Link className="text-primary font-medium" to="/signup">
      Sign up
    </Link>
  </p>
</div>
</div>
  )
}

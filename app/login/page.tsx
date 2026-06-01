"use client"
import { useRouter } from "next/navigation";
import { useState } from "react"

type AuthState = "login" | "sign up"

type Warning = {
    show: boolean,
    message: string
}

function LoginPage() {

    const router = useRouter()

    const [authState, setAuthState] = useState<AuthState>("login");
    const [warning, setWarning] = useState<Warning>({ show: false, message:""})
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setIsLoading(true)
        if(authState === "login"){
            const res = await fetch("/api/user/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ email, password})
            });
            switch(res.status){
                case 404:
                    setWarning({ show: true, message: "Email not registered"});
                    break;
                case 400: 
                    setWarning({ show: true, message: "Missing required Fields"});
                    break;
                case 401: 
                    setWarning({ show: true, message: "Wrong Email or Password"});
                    break;
                case 200:
                    router.push("/dashboard")
                    break;
            }
            setIsLoading(false)
        }
        else if(authState === "sign up"){
            const res = await fetch("/api/user/signup", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ email, password, name})
            });
            switch(res.status){
                case 404:
                    setWarning({ show: true, message: "Email not registered"});
                    break;
                case 400: 
                    setWarning({ show: true, message: "Missing required Fields"});
                    break;
                case 401: 
                    setWarning({ show: true, message: "Wrong Email or Password"});
                    break;
                case 201: 
                    router.push("/dashboard")
                    break;
            }
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-linear-to-bl from-blue-950 to-gray-800">
            <form onSubmit={handleSubmit} className="flex flex-col bg-gray-600/40 backdrop-blur-2xl rounded-2xl p-6 w-80">
                <h1 className="text-white font-bold text-2xl mb-5">{ authState === "login" ? "Login" : "Sign up"}</h1>
                
               { 
               (authState === "sign up") 
               && 
               <>
                <label className="text-gray-300 text-sm mb-1">name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="p-2 text-white rounded-xl focus:outline-0 bg-gray-700 mb-4" placeholder="John Doe" type="text" />
                </>
                }


                <label className="text-gray-300 text-sm mb-1">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="p-2 text-white rounded-xl focus:outline-0 bg-gray-700 mb-4" placeholder="you@example.com" type="email" />

                <label className="text-gray-300 text-sm mb-1">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} className="p-2 text-white rounded-xl focus:outline-0 bg-gray-700 mb-4" placeholder="••••••••" type="password" />
                {
                    warning.show && 
                    <p className="text-red-400 text-sm mb-3 text-center">{warning.message}</p>
                }
                <button type="submit" disabled={isLoading} className="bg-white text-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed font-medium rounded-xl py-2  cursor-pointer hover:transform mt-1">
                   {  !isLoading ? (authState === "login" ? "Sign in" : "Sign up") : "Loading..."} 
                </button>

                <p className="text-center text-gray-400 text-sm mt-4">
                   { authState === "login" ? "Don't have an account?" : "Already have an account?" } <span onClick={() => setAuthState(prev => prev === "login" ? "sign up" : "login")}  className="text-gray-200 cursor-pointer underline">{ authState === "login" ? "Sign up" : "Login"}</span>
                </p>
            </form>
        </div>
    )
}

export default LoginPage
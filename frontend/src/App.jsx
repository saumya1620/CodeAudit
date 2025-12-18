import React, { useState } from 'react'
import "./App.css" 
import Navbar from './components/Navbar' 
import Editor from '@monaco-editor/react'; 
import Select from 'react-select'; 
//import { GoogleGenAI } from "@google/genai"; 
import Groq from 'groq-sdk'; 
import Markdown from 'react-markdown' 
import { useContext} from "react";
import { AuthContext } from "./context/AuthContext";
import History from './components/History';
import RingLoader from "react-spinners/RingLoader"; 
const App = () => { 
    const [page, setPage] = useState("editor"); // "editor" | "history"
const [loadedCode, setLoadedCode] = useState("");
const [loadedReview, setLoadedReview] = useState("");

    const { token } = useContext(AuthContext);
const [freeCount, setFreeCount] = useState(0);

    const options = [ 
        { value: 'javascript', label: 'JavaScript' }, 
        { value: 'python', label: 'Python' }, 
        { value: 'java', label: 'Java' }, 
        { value: 'csharp', label: 'C#' }, 
        { value: 'cpp', label: 'C++' }, 
        { value: 'php', label: 'PHP' }, 
        { value: 'ruby', label: 'Ruby' }, 
        { value: 'go', label: 'Go' }, 
        { value: 'swift', label: 'Swift' }, 
        { value: 'kotlin', label: 'Kotlin' }, 
        { value: 'typescript', label: 'TypeScript' }, 
        { value: 'rust', label: 'Rust' }, 
        { value: 'dart', label: 'Dart' }, 
        { value: 'scala', label: 'Scala' }, 
        { value: 'perl', label: 'Perl' }, 
        { value: 'haskell', label: 'Haskell' }, 
        { value: 'elixir', label: 'Elixir' }, 
        { value: 'r', label: 'R' }, 
        { value: 'matlab', label: 'MATLAB' }, 
        { value: 'bash', label: 'Bash' } 
    ]; 
    
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [loadedLanguage, setLoadedLanguage] = useState(options[0]);

    const customStyles = { 
        control: (provided) => ({ 
            ...provided, backgroundColor: '#18181b', // dark background (similar to bg-zinc-900) 
               borderColor: '#3f3f46', 
               color: '#fff', width: "100%" 
            }), 
            menu: (provided) => ({ 
                ...provided, backgroundColor: '#18181b', // dropdown 
                color: '#fff', 
                width: "100%" 
            }), 
            singleValue: (provided) => ({ 
                ...provided, color: '#fff', // selected option text 
                width: "100%" 
            }), 
            option: (provided, state) => ({ 
                ...provided, 
                backgroundColor: state.isFocused ? '#27272a' : '#18181b', // hover effect 
                color: '#fff', 
                cursor: 'pointer', 
                width: "30%" 
            }), 
            input: (provided) => ({ 
                ...provided, 
                color: '#fff', 
                width: "100%" 
            }), 
            placeholder: (provided) => ({ 
                ...provided, color: '#a1a1aa', // placeholder text color 
                width: "100%" 
            }), 
        }; 
        const [code, setCode] = useState(""); 
        //const ai = new GoogleGenAI({ apiKey: "AIzaSyDXk-ZhwXscAUAoAdIpGyUeNeZoTHgJgRw" }); 
        const groq = new Groq({ 
            apiKey: import.meta.env.VITE_GROQ_API_KEY, 
            dangerouslyAllowBrowser: true 
        }); 
        const [loading, setLoading] = useState(false); 
        const [response, setResponse] = useState(""); 
        const openNewEditor = () => {
  setLoadedCode("");
  setLoadedReview("");
  setSelectedOption(options[0]);
  setLoadedLanguage(options[0]);
  setPage("editor");
};

        // async function reviewCode() { 
        // // setResponse("") 
        // // setLoading(true); 
        // // const response = await ai.models.generateContent({ // model: "gemini-2.0-flash", // contents: You are an expert-level software developer, skilled in writing efficient, clean, and advanced code. // I’m sharing a piece of code written in ${selectedOption.value}. // Your job is to deeply review this code and provide the following: // 1️⃣ A quality rating: Better, Good, Normal, or Bad. // 2️⃣ Detailed suggestions for improvement, including best practices and advanced alternatives. // 3️⃣ A clear explanation of what the code does, step by step. // 4️⃣ A list of any potential bugs or logical errors, if found. // 5️⃣ Identification of syntax errors or runtime errors, if present. // 6️⃣ Solutions and recommendations on how to fix each identified issue. // Analyze it like a senior developer reviewing a pull request. // Code: ${code} // , // }); // setResponse(response.text) // setLoading(false); // } 
        async function reviewCode() { 
            setResponse(""); 
            setLoading(true); 
            try { 
                const chatCompletion = await groq.chat.completions.create({ 
                    model: "llama-3.1-8b-instant", 
                    messages: [ 
                        { 
                            role: "system", 
                            content: "You are an expert-level senior software engineer who reviews code professionally." }, 
                            { 
                                role: "user", 
                                content: `
                                    I’m sharing a piece of code written in ${selectedOption.value}.
                                    you are a strict senior software developer. 
                                    Your job is to deeply review this code 
                                    Rules: 
                                    - Code with runtime errors, undefined variables, or crashes is bad. 
                                    - Enterprise-grade, fully safe, efficient, and clean code is excellent. 
                                    - Works fine,but minor improvement possible is good. 
                                    - works but unsafe, missing best practices ,Minimal structure or missing error handling is average. 
                                    Provide the following:
                                    1️⃣ A quality rating: Excellent, Good, Average , or Bad. 
                                    2️⃣ Detailed suggestions for improvement. 
                                    3️⃣ Step-by-step explanation of what the code does. 
                                    4️⃣ Any bugs or logical errors if present. 
                                    5️⃣ Syntax or runtime issues if present. 
                                    6️⃣ How to fix each issue if issue is there.
                                    
                                    Code: 
                                    ${code} 
                                   `
                                } 
                            ] 
                        }); 

                        setResponse(chatCompletion.choices[0].message.content);
                        if (token) {
  await fetch("http://localhost:5000/api/review", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      language: selectedOption.value,
      code,
      review: chatCompletion.choices[0].message.content
    })
  });
}

        }
                     catch (err) 
                     { 
                        console.error(err); 
                        alert("Something went wrong. Check console."); 
                    } 
                    finally 
                    { 
                        setLoading(false); 
                    } 
                } 
    
                return (
                    <>
                     <Navbar onHistory={() => setPage("history")} />
                    {page==="editor" && (

                        //<Navbar onHistory={() => setPage("history")} /> 
                    <div className="main flex justify-between" style={{ height: "calc(100vh - 90px" }}> 
                        <div className="left h-[87.5%] w-[50%]"> 
                        <div className="tabs !mt-5 !px-5 !mb-3 w-full flex items-center gap-[10px]"> 
                            <Select value={selectedOption} onChange={(e) => { setSelectedOption(e) }} options={options} styles={customStyles} /> {/* <button className="btnNormal bg-zinc-900 min-w-[120px] transition-all hover:bg-zinc-800">Fix Code</button> */} 
                                <button onClick={() => { if (code === "") { alert("Please enter code first") } if (!token && freeCount >=2) { alert("Login to continue using CodeAudit");
                                return;
                                    
                                } 
                                if(!token) setFreeCount(prev => prev + 1); 
                                else { reviewCode() } }} className="btnNormal bg-zinc-900 min-w-[120px] transition-all hover:bg-zinc-800">Review</button> 
                                </div> 
                                <Editor height="100%" theme='vs-dark' language={selectedOption.value} value={loadedCode || code} onChange={(e) => { 
                                    setLoadedCode("");
                                    setCode(e) 
                                    }} 
                                    /> 
                                    </div> 
                                <div className="right overflow-scroll !p-[10px] bg-zinc-900 w-[50%] h-[101%]"> <div className="topTab border-b-[1px] border-t-[1px] border-[#27272a] flex items-center justif-between h-[60px]"> 
                                    <p className='font-[700] text-[17px]'>Response</p> 
                                    </div> {loading && <RingLoader color='#9333ea'/>} <Markdown>{loadedReview ||response}</Markdown> 
                                    </div> 
                                    </div> 
                                    ) 
} 
{page === "history" && (
  <History
    openEditor={(item) => {
      setLoadedCode(item.code);
      setLoadedReview(item.review);
      setLoadedLanguage(
        options.find(o => o.value === item.language)
      );
      setSelectedOption(
        options.find(o => o.value === item.language)
      );
      setPage("editor");
    }}
    openNewEditor={openNewEditor}
  />
)} 
</> 
); 
}

           
export default App
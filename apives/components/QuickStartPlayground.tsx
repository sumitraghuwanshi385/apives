import React, { useState, useEffect } from "react";
import { Copy, Check, Key } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter/dist/esm";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const QuickStartPlayground = () => {

const [lang,setLang] = useState("python");
const [copied,setCopied] = useState(false);
const [code,setCode] = useState("");

const snippets:any = {

python:`import apives

client = apives.Client(api_key="YOUR_API_KEY")

response = client.chat.create(
  model="apives-gpt",
  messages=[
    {"role":"user","content":"Hello"}
  ]
)

print(response.output)
`,

node:`import Apives from "apives"

const client = new Apives({
 apiKey:"YOUR_API_KEY"
})

const response = await client.chat.create({
 model:"apives-gpt",
 messages:[
  {role:"user",content:"Hello"}
 ]
})

console.log(response.output)
`,

curl:`curl https://api.example.com/v1/chat \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
 "message":"Hello"
}'
`,

go:`package main

import "fmt"

func main(){
 fmt.Println("Send request using YOUR_API_KEY")
}`,

java:`public class ApiExample{
 public static void main(String[] args){
  System.out.println("Use YOUR_API_KEY to call API");
 }
}`,

php:`<?php

$apiKey="YOUR_API_KEY";

$response=file_get_contents(
"https://api.example.com?key=".$apiKey
);

echo $response;

?>`
};

useEffect(()=>{
setCode(snippets[lang]);
},[lang]);

const copyCode = async () => {
await navigator.clipboard.writeText(code);
setCopied(true);
setTimeout(()=>setCopied(false),1500);
};

return(

<section className="pt-8 pb-12 bg-black border-t border-white/5 relative overflow-hidden">

{/* green glow */}

<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.12),transparent_60%)]"/>

<div className="max-w-6xl mx-auto px-6 relative z-10">

{/* HEADER */}

<div className="text-center mb-4">

<h2 className="text-2xl md:text-4xl font-bold text-mora">
Quick Start Integration
</h2>

<p className="text-slate-400 text-xs sm:text-sm mt-2">
Example snippets showing how APIs are typically integrated in apps.
</p>

</div>

{/* TERMINAL */}

<div className="rounded-2xl border border-white/10 bg-[#070707] overflow-hidden">

{/* TERMINAL HEADER */}

<div className="flex items-center justify-between px-4 py-3 border-b border-white/10">

<div className="flex gap-2">
<div className="w-3 h-3 rounded-full bg-red-500"/>
<div className="w-3 h-3 rounded-full bg-yellow-400"/>
<div className="w-3 h-3 rounded-full bg-green-500"/>
</div>

<button
onClick={copyCode}
className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10"
>
{copied ? <Check size={16}/> : <Copy size={16}/>}
</button>

</div>

{/* LANGUAGE TABS */}

<div className="flex flex-wrap gap-2 px-4 py-3 border-b border-white/10">

{["python","node","curl","go","java","php"].map(l=>(
<button
key={l}
onClick={()=>setLang(l)}
className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
lang===l
? "bg-white text-black"
: "bg-white/5 text-slate-300 hover:bg-white/10"}
`}
>
{l}
</button>
))}

</div>

{/* CODE */}

<div className="p-5 text-xs md:text-sm overflow-x-auto">

<SyntaxHighlighter
language={lang === "node" ? "javascript" : lang}
style={oneDark}
customStyle={{
background:"transparent",
padding:0,
margin:0,
textShadow:"none"
}}
codeTagProps={{
style:{textShadow:"none"}
}}
>
{code}
</SyntaxHighlighter>

</div>

</div>

{/* DEVELOPER TIP */}

<div className="mt-3 rounded-lg border border-green-500/20 bg-green-500/10 p-2.5 text-[11px] text-green-300 flex items-center gap-2">

<div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
<Key className="w-3.5 h-3.5 text-green-400"/>
</div>

<p>

Store API keys securely using environment variables.
Never expose secret keys in frontend code.

</p>

</div>

</div>

</section>

);

};

export default QuickStartPlayground;

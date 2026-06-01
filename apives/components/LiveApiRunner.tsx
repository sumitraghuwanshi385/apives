import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter/dist/esm";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const LiveApiRunner = () => {

const [endpoint,setEndpoint]=useState("https://api.ipify.org?format=json");
const [method,setMethod]=useState("GET");
const [showMethods,setShowMethods]=useState(false);

const [headers,setHeaders]=useState("");
const [body,setBody]=useState("");

const [response,setResponse]=useState("");
const [loading,setLoading]=useState(false);

const [status,setStatus]=useState("");
const [statusCode,setStatusCode]=useState(null);
const [time,setTime]=useState(null);

const [history,setHistory]=useState([]);

const user = localStorage.getItem("mora_user");

const methods=[
"GET",
"POST",
"PUT",
"DELETE"
];

const presets=[
{ name:"IP API", url:"https://api.ipify.org?format=json"},
{ name:"Random User", url:"https://randomuser.me/api/"},
{ name:"Bitcoin Price", url:"https://api.coinbase.com/v2/prices/spot?currency=USD"},
{ name:"Weather", url:"https://api.open-meteo.com/v1/forecast?latitude=28.6&longitude=77.2&current_weather=true"},
{ name:"GitHub User", url:"https://api.github.com/users/vercel"},
{ name:"Dog Image", url:"https://dog.ceo/api/breeds/image/random"}
];

const autoResize=(e)=>{
const el=e.target;
el.style.height="auto";
el.style.height=el.scrollHeight+"px";
};

const formatJSON=(data)=>{
try{
return JSON.stringify(JSON.parse(data),null,2);
}catch{
return data;
}
};

const getStatusColor=()=>{

if(!statusCode) return "bg-white/10";

if(statusCode>=200 && statusCode<300)
return "bg-green-500/20 text-green-400";

if(statusCode>=400 && statusCode<500)
return "bg-yellow-500/20 text-yellow-400";

return "bg-red-500/20 text-red-400";
};

const sendRequest=async()=>{

if(!endpoint) return;

let parsedHeaders={};

if(headers.trim()!==""){
try{
parsedHeaders=JSON.parse(headers);
}catch{
parsedHeaders={};
}
}

setLoading(true);
setStatus("Running request...");
setStatusCode(null);
setTime(null);

const start=Date.now();

try{

const res=await fetch(
"https://apives-3xrc.onrender.com/api/runner/run",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
url:endpoint,
method,
headers:parsedHeaders,
body
})
}
);

const data=await res.json();

const duration=Date.now()-start;

setTime(duration);

if(data.success){

const json=formatJSON(JSON.stringify(data.data));

setResponse(json);
setStatusCode(data.status);
setStatus("Success");

if(user){

setHistory(prev=>[
{url:endpoint,method,time:duration},
...prev.slice(0,10)
]);

}

}else{

setResponse(JSON.stringify(data,null,2));
setStatus("Error");

}

}catch{

setResponse(`Request failed

Possible reasons:
• API requires authentication
• API blocked request
• Invalid endpoint`);

setStatus("Runner Error");

}

setLoading(false);

};

const clearResponse=()=>{
setEndpoint("");
setHeaders("");
setBody("");
setResponse("");
setStatus("");
setStatusCode(null);
setTime(null);
};

const clearHistory=()=>{
setHistory([]);
};

const copyResponse=async()=>{
if(!response) return;
await navigator.clipboard.writeText(response);
};

return(

<section className="py-10 bg-black border-t border-white/5 relative overflow-hidden">


<div className="max-w-6xl mx-auto px-4 relative z-10">


<p className="text-center text-xs text-slate-500 mb-3">
Try these example APIs to quickly test the runner
</p>

<div className="flex flex-wrap justify-center gap-2 mb-5">

{presets.map((p,i)=>(
<button
key={i}
onClick={()=>setEndpoint(p.url)}
className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20 hover:bg-white/20"
>
{p.name}
</button>
))}

</div>

<div className="bg-[#070707] border border-white/10 rounded-2xl p-4">

<div className="flex flex-wrap gap-2 mb-3 items-center">

<div className="relative">

<button
onClick={()=>setShowMethods(!showMethods)}
className="px-3 py-2 text-xs rounded bg-black border border-white/10"
>
{method}
</button>

{showMethods && (

<div className="absolute top-9 left-0 bg-black border border-white/10 rounded shadow-lg z-20">

{methods.map(m=>(
<div
key={m}
onClick={()=>{setMethod(m);setShowMethods(false)}}
className="px-4 py-2 text-xs hover:bg-white/10 cursor-pointer"
>
{m}
</div>
))}

</div>

)}

</div>

<input
value={endpoint}
onChange={(e)=>setEndpoint(e.target.value)}
className="flex-1 min-w-0 bg-black border border-white/10 text-sm px-3 py-2 rounded text-white"
placeholder="Enter API URL"
/>

<button
onClick={sendRequest}
className="px-4 py-2 text-xs rounded-full bg-green-500/20 border border-green-500/30 hover:bg-green-500/30"
>
Run
</button>

<button
onClick={clearResponse}
className="px-4 py-2 text-xs rounded-full bg-white/10 border border-white/20"
>
Clear
</button>

</div>

{/* HEADERS */}

<div className="mb-3">

<p className="text-xs text-slate-400 mb-1">
Headers (optional JSON)
</p>

<p className="text-[11px] text-slate-500 mb-2">
Add request headers here in JSON format if required.
Example: Authorization token, API key, custom headers.
</p>

<textarea
value={headers}
onChange={(e)=>{
setHeaders(e.target.value);
autoResize(e);
}}
onInput={autoResize}
rows={2}
placeholder={`{
 "Content-Type":"application/json",
 "Authorization":"Bearer YOUR_API_KEY"
}`}
className="w-full bg-black border border-white/10 rounded text-xs p-2 text-white resize-none"
/>

</div>

{method!=="GET" && (

<div className="mb-3">

<p className="text-xs text-slate-400 mb-1">
Request Body (JSON)
</p>

<p className="text-[11px] text-slate-500 mb-2">
Add JSON request body here for POST or PUT requests.
</p>

<textarea
value={body}
onChange={(e)=>{
setBody(e.target.value);
autoResize(e);
}}
onInput={autoResize}
rows={2}
placeholder={`{
 "example":"data"
}`}
className="w-full bg-black border border-white/10 rounded text-xs p-2 text-white resize-none"
/>

</div>

)}

<div className="flex flex-wrap items-center gap-3 mb-2 text-xs font-mono">

{status && <span className="text-green-400">{status}</span>}

{statusCode && (
<span className={`px-2 py-0.5 rounded ${getStatusColor()}`}>
{statusCode}
</span>
)}

{time && (
<span className="bg-white/10 px-2 py-0.5 rounded">
⏱ {time} ms
</span>
)}

<button
onClick={copyResponse}
className="ml-auto text-xs px-2 py-1 border border-white/10 rounded"
>
Copy JSON
</button>

</div>

<div className="border border-white/10 rounded-xl p-4 bg-black/80 text-xs overflow-x-auto">

<SyntaxHighlighter
language="json"
style={oneDark}
customStyle={{
background:"transparent",
margin:0,
padding:0,
textShadow:"none"
}}
codeTagProps={{
style:{textShadow:"none"}
}}
>

{loading ? "Loading..." : response || "Response will appear here"}

</SyntaxHighlighter>

</div>

</div>

{user && history.length>0 && (

<div className="mt-5">

<div className="flex justify-between items-center mb-2">

<p className="text-xs text-slate-400">Recent Requests</p>

<button
onClick={clearHistory}
className="text-xs text-red-400 hover:text-red-300"
>
Clear All
</button>

</div>

<div className="space-y-1">

{history.map((h,i)=>(
<div
key={i}
className="text-xs text-slate-400 flex justify-between bg-white/5 px-2 py-1 rounded"
>

<span>{h.method}</span>

<span className="truncate max-w-[200px]">{h.url}</span>

<span>{h.time}ms</span>

</div>
))}

</div>

</div>

)}

</div>

</section>

);

};

export default LiveApiRunner;
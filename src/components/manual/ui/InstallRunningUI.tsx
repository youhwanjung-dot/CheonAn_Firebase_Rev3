// import React from 'react'; // 최신 React/Vite에서는 불필요하여 주석 처리 (TS6133)

const InstallRunningUI = () => {
  return (
    <div className="bg-black p-4 rounded-lg font-mono text-[10px] text-slate-300">
      <p><span className="text-green-400">$</span> <span className="text-white">npm run dev</span></p>
      <br />
      <p><span className="text-white">{`> react-project@0.0.0 dev`}</span></p>
      <p><span className="text-white">{`> concurrently "npm:server" "npm:client"`}</span></p>
      <br />
      <p><span className="text-cyan-400">[server]</span> {`> react-project@0.0.0 server`}</p>
      <p><span className="text-cyan-400">[server]</span> {`> tsx watch server.ts`}</p>
      <p><span className="text-purple-400">[client]</span> {`> react-project@0.0.0 client`}</p>
      <p><span className="text-purple-400">[client]</span> {`> vite`}</p>
      <br />
      <p><span className="text-cyan-400">[server]</span> <span className="text-yellow-300">Server is running on http://localhost:3001</span></p>
      <br />
      <p><span className="text-purple-400">[client]</span>   <span className="text-green-400">VITE v5.x.x</span>  ready in <span className="text-white">1.23s</span></p>
      <p><span className="text-purple-400">[client]</span></p>
      <p><span className="text-purple-400">[client]</span>   ➜  <span className="font-bold">Local:</span>   <span className="text-blue-400">http://localhost:5173/</span></p>
      <p><span className="text-purple-400">[client]</span>   ➜  <span className="font-bold">Network:</span> use --host to expose</p>
      <p><span className="text-purple-400">[client]</span>   ➜  <span className="font-bold">Press <span className="text-yellow-300">h + enter</span> to show help</span></p>
    </div>
  );
};

export default InstallRunningUI;

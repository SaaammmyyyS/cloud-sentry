import React, { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { motion, AnimatePresence } from "framer-motion";
import awsmobile from "./aws-exports";

import BackgroundEffects from "./components/BackgroundEffects";
import Header from "./components/Header";
import ThreatCard from "./components/ThreatCard";
import ScanningState from "./components/ScanningState";

Amplify.configure(awsmobile);
const client = generateClient();

export default function App() {
  const [threats, setThreats] = useState([]);
  const [status, setStatus] = useState("OFFLINE");
  const [totalDetected, setTotalDetected] = useState(0);

  useEffect(() => {
    document.title = "CLOUD-SENTRY // LIVE";

    const fetchHistory = async () => {
      const listQuery = `query GetRecentThreats { getRecentThreats(limit: 10) { type severity sourceIp timestamp location } }`;
      try {
        const response = await client.graphql({ query: listQuery });
        const history = response.data.getRecentThreats || [];
        setThreats(history);
        setTotalDetected(history.length);
        setStatus("LISTENING");
      } catch (e) {
        setStatus("ERROR");
      }
    };

    fetchHistory();

    const subQuery = `subscription OnNewThreat { onNewThreat { type severity sourceIp timestamp location } }`;
    const subscription = client.graphql({ query: subQuery }).subscribe({
      next: ({ data }) => {
        if (data?.onNewThreat) {
          const newThreat = data.onNewThreat;
          setThreats((prev) => [newThreat, ...prev].slice(0, 8));
          setTotalDetected((prev) => prev + 1);
          setStatus("ACTIVE");

          setTimeout(() => setStatus("LISTENING"), 3000);
        }
      },
      error: () => setStatus("ERROR"),
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen text-slate-300 font-mono relative">
      <BackgroundEffects status={status} />

      <div className="relative max-w-5xl mx-auto px-6 z-10 animate-flicker">
        <Header status={status} totalDetected={totalDetected} />

        <main className="pb-20">
          <div className="flex items-center gap-4 text-emerald-500/80 mb-6">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase whitespace-nowrap">Live_Intercept_Stream</span>
            <div className="h-[1px] w-full bg-gradient-to-r from-emerald-500/50 to-transparent opacity-20" />
          </div>

          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {threats.length === 0 ? (
                <motion.div key="loading" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                  <ScanningState />
                </motion.div>
              ) : (
                threats.map((threat, index) => (
                  <motion.div
                    key={`${threat.timestamp}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    layout
                  >
                    <ThreatCard threat={threat} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </main>

        <footer className="py-8 border-t border-white/5 flex justify-between opacity-20 text-[9px] uppercase tracking-[0.3em]">
           <p>Auth: Ivan_Verified</p>
           <p>© 2026 Cloud-Sentry Intelligence</p>
        </footer>
      </div>
    </div>
  );
}
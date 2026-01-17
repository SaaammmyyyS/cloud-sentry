import React, { useEffect, useState, useCallback } from "react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { motion, AnimatePresence } from "framer-motion";
import awsmobile from "./aws-exports";

import BackgroundEffects from "./components/BackgroundEffects";
import Header from "./components/Header";
import ThreatCard from "./components/ThreatCard";
import ScanningState from "./components/ScanningState";
import FeedDivider from "./components/FeedDivider";

Amplify.configure(awsmobile);
const client = generateClient();

export default function App() {
  const [threats, setThreats] = useState([]);
  const [status, setStatus] = useState("OFFLINE");
  const [totalDetected, setTotalDetected] = useState(0);

  const fetchHistory = useCallback(async () => {
    const listQuery = `
      query GetRecentThreats {
        getRecentThreats(limit: 10) {
          threatId
          type
          severity
          sourceIp
          timestamp
          location
          ai_analysis
        }
      }`;

    try {
      const response = await client.graphql({ query: listQuery });
      const history = response.data.getRecentThreats || [];
      setThreats(history);
      setTotalDetected(history.length);
      setStatus("LISTENING");
    } catch (e) {
      console.error("Fetch error:", e);
      setStatus("ERROR");
    }
  }, []);

  useEffect(() => {
    document.title = "CLOUD-SENTRY // LIVE";
    fetchHistory();

    const subQuery = `
      subscription OnNewThreat {
        onNewThreat {
          threatId
          type
          severity
          sourceIp
          timestamp
          location
          target_resource
          ai_analysis
        }
      }`;

    const subscription = client.graphql({ query: subQuery }).subscribe({
      next: ({ data }) => {
        if (data?.onNewThreat) {
          const newThreat = data.onNewThreat;
          setThreats((prev) => {
            const exists = prev.find(t => t.threatId === newThreat.threatId);
            if (exists) {
              return prev.map(t => t.threatId === newThreat.threatId ? newThreat : t);
            }
            return [newThreat, ...prev].slice(0, 10);
          });
          setTotalDetected((prev) => prev + 1);
          setStatus("ACTIVE");
          setTimeout(() => setStatus("LISTENING"), 3000);
        }
      },
      error: (err) => {
        console.error("Subscription error:", err);
        setStatus("ERROR");
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchHistory]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-mono relative overflow-x-hidden selection:bg-emerald-500/30">
      <BackgroundEffects status={status} />

      {/* Main Container: Responsive Padding */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 z-10">
        <Header status={status} totalDetected={totalDetected} />

        <main className="pb-20">
          <FeedDivider title="Live_Threat_Feed" />

          {/* Grid: 1 column on mobile, scales on larger screens if needed */}
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {threats.length === 0 ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ScanningState />
                </motion.div>
              ) : (
                threats.map((threat) => (
                  <motion.div
                    key={threat.threatId || threat.timestamp}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                  >
                    <ThreatCard threat={threat} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </main>

        <footer className="py-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 opacity-30 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-center sm:text-left">
           <p>Terminal: {awsmobile.aws_project_region}_node_01</p>
           <p>© 2026 Cloud-Sentry Intelligence</p>
        </footer>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ScrollText,
  Search,
  ArrowLeft,
  Trash2,
  RefreshCw,
  Eye,
  X,
} from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VerificationResults from "../components/VerificationResults";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  getAuditLogs,
  clearAuditLogs,
  deleteAuditLog,
} from "../services/auditLogService";

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null); // For modal
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Load logs from localStorage on mount
  useEffect(() => {
    setLogs(getAuditLogs());
  }, []);

  const refreshLogs = () => {
    setLogs(getAuditLogs());
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleDeleteLog = (id) => {
    deleteAuditLog(id);
    setLogs(getAuditLogs());
    if (selectedLog?.id === id) setSelectedLog(null);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all audit logs?")) {
      clearAuditLogs();
      setLogs([]);
      setSelectedLog(null);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filter !== "all" && log.decision !== filter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        (log.reason && log.reason.toLowerCase().includes(term)) ||
        (log.personName && log.personName.toLowerCase().includes(term)) ||
        (log.decision && log.decision.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const getDecisionBadge = (decision) => {
    const variants = {
      APPROVE: "default",
      REJECT: "destructive",
      REVIEW: "secondary",
      RECAPTURE: "outline",
      ERROR: "outline",
    };
    return variants[decision] || "outline";
  };

  // Helper to normalize log data for VerificationResults component
  const getNormalizedResult = (log) => {
    if (!log) return null;
    return {
      ...log,
      // For the detailed view (AI results), we want the AI's decision (e.g., "approve", "manual_review")
      // rather than the Banker's action (e.g., "APPROVE", "REJECT").
      // New logs store this in 'ai_decision'. Old logs might just have 'decision' (which is now Banker's action)
      // or 'decision' (which was AI decision before).
      // Prioritize ai_decision if available.
      decision: log.ai_decision || log.decision,

      similarity_score:
        log.similarity_score !== undefined
          ? log.similarity_score
          : log.similarity
            ? log.similarity / 100
            : 0,
      confidence_level: log.confidence_level || log.confidence,
      // Ensure other fields are present or defaulted if missing in old logs
      quality: log.quality || { sharpness: 0, brightness: 0 },
      explanation: log.explanation || log.reason,
    };
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={{
            name: user?.banker_name || "Banker",
            branchId: user?.branch_code || "HQ",
          }}
          onLogout={handleLogout}
        />
        <div className="flex-1 overflow-y-auto bg-muted/40 pb-12 pt-8">
          <div className="container mx-auto max-w-7xl px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ScrollText className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Audit Logs
                  </h1>
                  <p className="text-muted-foreground">
                    View verification history and decisions
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={refreshLogs}
                  className="gap-2"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="gap-2"
                  size="sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </Button>
              </div>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, reason, or decision..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {["all", "APPROVE", "REJECT", "RECAPTURE"].map((f) => (
                      <Button
                        key={f}
                        variant={filter === f ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter(f)}
                      >
                        {f === "all" ? "All" : f}
                      </Button>
                    ))}
                  </div>
                  {logs.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAll}
                      className="text-destructive hover:text-destructive gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      Clear All
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Logs Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Verification History</CardTitle>
                  <Badge variant="secondary">
                    {filteredLogs.length} entries
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 text-sm font-semibold">
                          Timestamp
                        </th>
                        <th className="text-left p-3 text-sm font-semibold">
                          Person
                        </th>
                        <th className="text-left p-3 text-sm font-semibold">
                          Status
                        </th>
                        <th className="text-left p-3 text-sm font-semibold">
                          Decision
                        </th>
                        <th className="text-left p-3 text-sm font-semibold">
                          Similarity
                        </th>
                        <th className="text-left p-3 text-sm font-semibold">
                          Confidence
                        </th>
                        <th className="text-left p-3 text-sm font-semibold">
                          Reason
                        </th>
                        <th className="text-left p-3 text-sm font-semibold w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="border-b hover:bg-accent/50 transition-colors"
                        >
                          <td className="p-3 text-sm font-mono whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span>{log.timestamp}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-primary"
                                onClick={() => setSelectedLog(log)}
                                title="View Details"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                          <td className="p-3 text-sm font-medium">
                            {log.personName || "—"}
                          </td>
                          <td className="p-3">
                            <Badge
                              className="highlight-contrast border-none"
                              variant={
                                log.status === "SUCCESS"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {log.status}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge
                              className="font-bold underline decoration-2 underline-offset-4"
                              variant={getDecisionBadge(log.decision)}
                            >
                              {log.decision}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm">
                            <span className="highlight-contrast font-mono px-2 py-0.5 rounded">
                              {log.similarity}%
                            </span>
                          </td>
                          <td className="p-3 text-sm">{log.confidence}</td>
                          <td className="p-3 text-sm text-muted-foreground max-w-[200px] truncate">
                            {log.reason}
                          </td>
                          <td className="p-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteLog(log.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredLogs.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <ScrollText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No logs found</p>
                      <p className="text-sm mt-1">
                        {logs.length === 0
                          ? "Verification decisions will appear here after you approve or reject"
                          : "Try adjusting your search or filter"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedLog(null)}
          />
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl bg-background shadow-2xl border animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex items-center justify-between border-b px-6 py-4 bg-background/95 backdrop-blur z-10 sticky top-0">
              <div className="flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold">Verification Details</h2>
                <Badge variant="outline" className="ml-2 font-mono">
                  {selectedLog.timestamp}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedLog(null)}
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <VerificationResults result={getNormalizedResult(selectedLog)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogsPage;

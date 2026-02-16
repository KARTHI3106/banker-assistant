import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollText, Search, ArrowLeft, Trash2, RefreshCw } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
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
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all audit logs?")) {
      clearAuditLogs();
      setLogs([]);
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
                            {log.timestamp}
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
    </div>
  );
};

export default AuditLogsPage;

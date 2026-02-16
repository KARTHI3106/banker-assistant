// Audit log service using localStorage for persistence

const STORAGE_KEY = "banker_audit_logs";

export const getAuditLogs = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addAuditLog = (entry) => {
  const logs = getAuditLogs();
  const newEntry = {
    id: Date.now(),
    timestamp: new Date().toLocaleString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
    ...entry,
  };
  logs.unshift(newEntry); // newest first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  return newEntry;
};

export const clearAuditLogs = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const deleteAuditLog = (id) => {
  const logs = getAuditLogs().filter((log) => log.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
};

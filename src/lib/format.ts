export function formatBytes(bytes: number | null | undefined): string | null {
  if (bytes == null) return null;
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(0)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

export function formatDuration(seconds: number | null | undefined): string | null {
  if (seconds == null) return null;
  const total = Math.floor(seconds);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

export function formatPercent(value: number | null | undefined, fractionDigits = 0): string | null {
  if (value == null || Number.isNaN(value)) return null;
  return `${(value * 100).toFixed(fractionDigits)}%`;
}

export function formatDate(ms: number | null | undefined): string | null {
  if (ms == null) return null;
  return new Date(ms).toLocaleString();
}

export function formatNumber(value: number | null | undefined, fractionDigits = 2): string | null {
  if (value == null || Number.isNaN(value)) return null;
  return value.toFixed(fractionDigits);
}

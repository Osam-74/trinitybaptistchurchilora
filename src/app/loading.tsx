export default function Loading() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-accent/20 border-t-accent animate-spin mx-auto mb-4" />
        <p className="text-text-muted text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

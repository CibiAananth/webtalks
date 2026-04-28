interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="error-banner">
      <span>{message}</span>
      {onRetry && (
        <button className="btn-ghost" onClick={onRetry} style={{ marginLeft: "1rem" }}>
          Retry
        </button>
      )}
    </div>
  );
}

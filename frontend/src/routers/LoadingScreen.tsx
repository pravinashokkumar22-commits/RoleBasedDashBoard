

export function LoadingScreen() {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--page-bg)' }}>
      <div className="spinner spinner-dark" style={{ width: 28, height: 28, borderWidth: 3 }} />
    </div>
  );
}

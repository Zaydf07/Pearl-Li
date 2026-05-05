import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-media">
        <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&q=80" alt="" />
        <div className="auth-media-overlay" />
        <div className="auth-media-content">
          <div className="logo">Pearl <span>&</span> Li</div>
          <h2>Welcome Back</h2>
          <p>Sign in to access your personal account, wishlist, and exclusive member benefits.</p>
        </div>
      </div>
      <div className="auth-form-panel">
        <LoginForm />
      </div>
    </div>
  );
}

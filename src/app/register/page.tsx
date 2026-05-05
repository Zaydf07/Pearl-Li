import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="auth-media">
        <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=80" alt="" />
        <div className="auth-media-overlay" />
        <div className="auth-media-content">
          <div className="logo">Pearl <span>&</span> Li</div>
          <h2>Join the Circle</h2>
          <p>Create your account for exclusive access to new collections, private events, and bespoke services.</p>
        </div>
      </div>
      <div className="auth-form-panel">
        <RegisterForm />
      </div>
    </div>
  );
}

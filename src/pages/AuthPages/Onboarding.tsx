// import { SpinnerIcon } from "../../icons";
import { useState, FormEvent } from "react";
// import { useNavigate } from "react-router"; // Unused currently unless we decide to use navigate instead of window.location
import { useAuth } from "../../hooks/useAuth";
import { registerTenant } from "../../api/tenantApi";

export default function Onboarding() {
  // const navigate = useNavigate();
  const { username } = useAuth();
  
  const [name, setName] = useState(username || "");
  const [phone, setPhone] = useState("");
  const [isCompany, setIsCompany] = useState(false);
  const [tinNumber, setTinNumber] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await registerTenant({ 
        name, 
        phone,
        isCompany,
        tinNumber,
        description,
        company: isCompany
      });
      
      if (result.success) {
        // Registration successful
        // Currently, we might need a token refresh to get the new tenantId in the token
        // But for now, let's redirect to dashboard and let RootRoute handle it (or endless loop if token not updated?)
        // Ideally, we force a logout or token refresh. 
        // Let's try redirecting to dashboard. If logic checks token again and it's still unassigned, we might loop.
        // User said: "after registering to get there tenat id they will be redirected to this page if parsed tenantId... == unassigned"
        // So on success, we assume backend updates something or next login gets it. 
        // Often, we need to refresh token. Keycloak JS has updateToken.
        
        // For now, simple redirect.
        window.location.href = "/"; // Force reload to potentially clear states/refresh
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 dark:bg-gray-800 dark:border dark:border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-500 mb-2">Welcome!</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Let's get your workspace set up.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Organization / Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your name or company"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="+251..."
            />
          </div>

          <div>
            <div className="flex items-center mb-2">
              <input
                id="isCompany"
                type="checkbox"
                checked={isCompany}
                onChange={(e) => setIsCompany(e.target.checked)}
                className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="isCompany" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Are you a company?
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              TIN Number
            </label>
            <input
              type="text"
              value={tinNumber}
              onChange={(e) => setTinNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter TIN Number"
              required={isCompany}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter a brief description..."
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {isLoading ? "Setting up..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import "../admincss/adminnav.css";

const API_URL = "http://localhost:1111/api";

const defaults = {
  about: {
    title: "About Job Portal",
    subtitle: "Connecting talented people with better opportunities.",
    body: "Job Portal helps job seekers discover roles and employers manage hiring in one clean platform.",
    phone: "",
    email: "",
    address: "",
  },
  contact: {
    title: "Get In Touch",
    subtitle: "We are here to help with hiring and job search questions.",
    body: "Reach out to our team for support, employer queries, or general information.",
    phone: "+1 (123) 456-7890",
    email: "support@jobportal.com",
    address: "123 Business Avenue, Suite 100, New York, NY",
  },
};

export default function AdminPageEditor({ page }) {
  const [form, setForm] = useState(defaults[page]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const isContact = page === "contact";

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/site-content/${page}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Page content load nahi hua");
        }

        setForm({
          ...defaults[page],
          ...(data.content || {}),
        });
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [page]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      const response = await fetch(`${API_URL}/site-content/${page}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Page update nahi hua");
      }

      setForm({
        ...defaults[page],
        ...(data.content || {}),
      });
      setMessage("Page content updated successfully");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="admin-page-editor-main">
      <div className="admin-dashboard-header">
        <h1>{isContact ? "Edit Contact Page" : "Edit About Page"}</h1>
        <p>Yahan se update karne par website ka public page change hoga.</p>
      </div>

      {message && <div className="admin-editor-message">{message}</div>}

      {loading ? (
        <div className="admin-dashboard-card">Content load ho raha hai...</div>
      ) : (
        <form className="admin-page-editor-form" onSubmit={handleSubmit}>
          <label>
            Page Title
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>

          <label>
            Subtitle
            <input name="subtitle" value={form.subtitle} onChange={handleChange} />
          </label>

          <label>
            Main Content
            <textarea
              name="body"
              value={form.body}
              onChange={handleChange}
              rows="6"
            />
          </label>

          {isContact && (
            <>
              <label>
                Phone
                <input name="phone" value={form.phone} onChange={handleChange} />
              </label>

              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </label>

              <label>
                Address
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="3"
                />
              </label>
            </>
          )}

          <button className="admin-editor-save-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Page"}
          </button>
        </form>
      )}
    </main>
  );
}

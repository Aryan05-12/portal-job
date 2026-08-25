import { useEffect, useState } from "react";
import "../styling/contact.css";
import Nav from "./Nav";

const defaultContent = {
  title: "Get In Touch",
  subtitle: "We are here to help with hiring and job search questions.",
  body: "Reach out to our team for support, employer queries, or general information.",
  phone: "+1 (123) 456-7890",
  email: "support@jobportal.com",
  address: "123 Business Avenue, Suite 100, New York, NY",
};

const Contact = () => {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch("https://jon-available.onrender.com/api/site-content/contact");
        const data = await response.json();

        if (response.ok && data.content) {
          setContent({ ...defaultContent, ...data.content });
        }
      } catch (error) {
        setContent(defaultContent);
      }
    };

    loadContent();
  }, []);

  return (
    <div>
      <Nav />
      <div className="contact-container">
        <header className="contact-header">
          <h1>{content.title}</h1>
          {content.subtitle && <p>{content.subtitle}</p>}
          {content.body && <span>{content.body}</span>}
        </header>

        <main className="contact-card">
          <div className="contact-item">
            <div className="contact-icon">P</div>
            <div className="contact-info">
              <h3>Phone Number</h3>
              <p>{content.phone || "N/A"}</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">@</div>
            <div className="contact-info">
              <h3>Email Address</h3>
              <p>{content.email || "N/A"}</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">A</div>
            <div className="contact-info">
              <h3>Our Address</h3>
              <p>{content.address || "N/A"}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Contact;

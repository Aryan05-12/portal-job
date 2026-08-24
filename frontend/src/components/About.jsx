import { useEffect, useState } from "react";
import Nav from "./Nav";
import "../styling/contact.css";

const defaultContent = {
  title: "About Job Portal",
  subtitle: "Connecting talented people with better opportunities.",
  body: "Job Portal helps job seekers discover roles and employers manage hiring in one clean platform.",
};

export default function About() {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch("http://localhost:1111/api/site-content/about");
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
      <main className="public-page-container">
        <section className="public-page-hero">
          <span>About Us</span>
          <h1>{content.title}</h1>
          {content.subtitle && <p>{content.subtitle}</p>}
        </section>

        <section className="public-page-content">
          <p>{content.body}</p>
        </section>
      </main>
    </div>
  );
}

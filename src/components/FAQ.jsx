import { Link } from "react-router-dom";

function FAQ() {
  const questions = [
    {
      question: "Are Lawnview estimates free?",
      answer:
        "Yes. Submit the free estimate form with your property address and service needs, and Lawnview will review your request.",
    },
    {
      question: "What areas does Lawnview serve?",
      answer:
        "Lawnview primarily serves Mesquite, Texas. Nearby properties may be accepted depending on location and availability.",
    },
    {
      question: "Do you offer recurring lawn service?",
      answer:
        "Yes. Customers can request weekly, every-two-weeks, or one-time service through the estimate form.",
    },
    {
      question: "How quickly will Lawnview respond?",
      answer:
        "Lawnview aims to respond to estimate requests within one business day by your preferred contact method.",
    },
    {
      question: "What information should I include?",
      answer:
        "Include your property address, the service you need, preferred frequency, lawn condition, approximate size, and any special instructions.",
    },
  ];

  return (
    <section className="faq-section">
      <div className="faq-heading">
        <p className="section-label">Common Questions</p>
        <h2>Everything you need to get started.</h2>
        <p>
          Find answers about Lawnview’s estimates, availability, and lawn-care
          services.
        </p>
      </div>

      <div className="faq-list">
        {questions.map((item) => (
          <details className="faq-item" key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>

      <div className="faq-cta">
        <p>Still have a question about your property?</p>
        <Link to="/contact">Contact Lawnview</Link>
      </div>
    </section>
  );
}

export default FAQ;
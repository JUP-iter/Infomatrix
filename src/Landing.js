import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css"; // Make sure to update your CSS accordingly
import { Analytics } from "@vercel/analytics/react";
const Landing = () => {
  return (
    <>
      <Analytics />
      <section className="landing-container">
        <header className="header-wrapper">
          <div className="header">
            <div className="logo-container">
              <img
                loading="lazy"
                src="./logo.png"
                className="logo-image"
                alt="IELTS AI Logo"
              />
              <div className="logo-text">IELTS AI</div>
            </div>
          </div>
        </header>
        <main className="main-content">
          <section className="hero-section">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2b901cad44e92711878253e66994c256105906db194c8c0d5a1e37fcba0e7131?apiKey=548f95a687a5477b882f6b9c8fbba7a0&"
              className="hero-image"
              alt="IELTS speaking analysis illustration"
            />
            <div className="hero-text">
              <h1 className="hero-title">IELTS speaking analysis</h1>
              <p className="hero-description">
                Get instant feedback on your speaking exam from our AI,
                including estimated band score and detailed remarks.
              </p>
              <Link to="/app" className="cta-button">
                Start now
              </Link>
            </div>
          </section>
          <section className="secondary-hero">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/5b720a147c596261673a200f2879081f91d1cfa5a5ad5b92eee22c95c881d1f3?apiKey=548f95a687a5477b882f6b9c8fbba7a0&"
              className="secondary-hero-image"
              alt="Dialog with AI illustration"
            />
            <div className="hero-text">
              <h2 className="secondary-hero-title">Dialog with AI</h2>
              <p className="secondary-hero-description">
                Practice speaking English with our AI, receive instant feedback
                and improve your speaking skills.
              </p>
              <Link to="/dialog" className="secondary-cta-button">
                Start now
              </Link>
            </div>
          </section>
          <section className="writing-hero">
            <img
              loading="lazy"
              src="https://static.vecteezy.com/system/resources/previews/025/424/111/non_2x/happy-girl-with-laptop-sitting-at-table-young-woman-student-or-freelancer-working-or-studying-on-a-computer-minimalist-style-home-office-online-education-concept-flat-illustration-vector.jpg"
              className="writing-hero-image"
              alt="Writing Checker illustration"
            />
            <div className="hero-text">
              <h2 className="writing-hero-title">Writing Checker</h2>
              <p className="writing-hero-description">
                Submit your IELTS Writing tasks and get AI-powered feedback
                instantly.
              </p>
              <Link to="/writing" className="writing-cta-button">
                Try now
              </Link>
            </div>
          </section>
          <section className="reading-hero">
            <img
              loading="lazy"
              src="https://c8.alamy.com/comp/2RHMJFK/read-book-concept-one-continuous-line-drawing-vector-illustration-minimalist-2RHMJFK.jpg"
              className="reading-hero-image"
              alt="Writing Checker illustration"
            />
            <div className="hero-text">
              <h2 className="writing-hero-title">Reading Passages by AI</h2>
              <p className="writing-hero-description">
                AI will generate you Reading Passage and show you the answers
              </p>
              <Link to="/reading" className="reading-cta-button">
                Try now
              </Link>
            </div>
          </section>
          <section className="listening-hero">
            <img
              loading="lazy"
              src="https://static.vecteezy.com/system/resources/previews/006/228/896/non_2x/girl-wearing-wireless-headphones-listening-to-music-with-free-space-for-text-illustration-vector.jpg"
              className="listening-hero-image"
              alt="Listening AI Illustration"
            />
            <div className="hero-text">
              <h2 className="listening-hero-title">Listening powered by AI</h2>
              <p className="listening-hero-description">
                AI will generate listening passages for different IELTS parts
                and play audio for you.
              </p>
              <Link to="/listening" className="listening-cta-button">
                Try now
              </Link>
            </div>
          </section>
          <h2 className="section-title">How it works</h2>
          <div className="how-it-works">
            <div className="how-it-works-grid">
              <div className="how-it-works-item">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/07b753a52441e19031e767a165ef3157054dfe1ca69446e7f79400e99b034775?apiKey=548f95a687a5477b882f6b9c8fbba7a0&"
                  className="how-it-works-image"
                  alt="Step 1 of how it works"
                />
              </div>
              <div className="how-it-works-item">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/2a3a8f7743e68dbdd0051a88238ca1e567b65dd6e6c627e4c31c83c2575c5ecd?apiKey=548f95a687a5477b882f6b9c8fbba7a0&"
                  className="how-it-works-image"
                  alt="Step 2 of how it works"
                />
              </div>
              <div className="how-it-works-item">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b4ee61eda005c229d1a15994297e6fae1b43a76cde8a54443358ca07ab8086a6?apiKey=548f95a687a5477b882f6b9c8fbba7a0&"
                  className="how-it-works-image"
                  alt="Step 3 of how it works"
                />
              </div>
            </div>
          </div>
          <h2 className="section-title">Testimonials</h2>
          <div className="testimonials">
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <img
                  loading="lazy"
                  src="/nurslam.jpg"
                  className="testimonial-avatar"
                  alt="Janny's profile picture"
                />
                <h3 className="testimonial-name">Nurislam(Speaking 7.5)</h3>
                <p className="testimonial-text">
                  The speaking analysis feature is really useful. It gives you a
                  score and detailed feedback, so you know what to work on. I
                  highly recommend it.
                </p>
              </div>
              <div className="testimonial-card">
                <img
                  loading="lazy"
                  src="\photo_2024-12-18_21-56-47.jpg"
                  className="testimonial-avatar"
                  alt="John's profile picture"
                />
                <h3 className="testimonial-name">Nagashbek(Speaking 7)</h3>
                <p className="testimonial-text">
                  I've been using the AI for a few weeks and I can already see a
                  big improvement in my speaking. It's a great tool for IELTS
                  prep.
                </p>
              </div>
              <div className="testimonial-card">
                <img
                  loading="lazy"
                  src="\sanjar.jpg"
                  className="testimonial-avatar"
                  alt="Jane's profile picture"
                />
                <h3 className="testimonial-name">Sanzhar(Speaking 7.5)</h3>
                <p className="testimonial-text">
                  The AI is so smart. It's like talking to a real person. It's
                  helped me a lot with my speaking skills.
                </p>
              </div>
            </div>
          </div>
          <h2 className="section-title">Features</h2>
          <div className="features">
            <div className="features-grid">
              <div className="feature-card">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/0ada8fdd2fab89def674d839622f949f64fd1f64459bfab2252ffed38fe542d7?apiKey=548f95a687a5477b882f6b9c8fbba7a0&"
                  className="feature-icon"
                  alt="AI Conversation Practice icon"
                />
                <h3 className="feature-title">AI Conversation Practice</h3>
                <p className="feature-description">
                  Practice speaking with our AI, receive instant feedback and
                  improve your speaking skills.
                </p>
              </div>
              <div className="feature-card">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/15e7827ccb42a9e572fe649d4138c8d0940215c869d55b4f97a1d238dfedbe6c?apiKey=548f95a687a5477b882f6b9c8fbba7a0&"
                  className="feature-icon"
                  alt="AI Speaking Analysis icon"
                />
                <h3 className="feature-title">AI Speaking Analysis</h3>
                <p className="feature-description">
                  Get instant feedback on your speaking exam from our AI,
                  including estimated band score and detailed remarks.
                </p>
              </div>
              <div className="feature-card">
                <img
                  loading="lazy"
                  src="./feedback-icon.png"
                  className="feature-icon"
                  alt="Feedback and Improvement icon"
                />
                <h3 className="feature-title">Feedback and Improvement</h3>
                <p className="feature-description">
                  Receive detailed feedback on your speaking, and use it to
                  improve your skills.
                </p>
              </div>
            </div>
          </div>
        </main>
      </section>
    </>
  );
};

export default Landing;

import "./App.css";
import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  animate,
} from "framer-motion";
import leaf from "./assets/leaf.png";
import mobileDuo from "./assets/mobile_duo1.png";
import mobileDuo2 from "./assets/mobile_duo2.png";
import mobileDuo3 from "./assets/mobile_duo3.png";
import db from "../src/FirebaseConfig/firebase-config";

const ScrollSection = ({
  id,
  title,
  subtext,
  description,
  image,
  stats,
  index,
  styles,
}) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Animation controls
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const mobileY = useTransform(scrollYProgress, [0, 0.4], [100, -100]);
  const mobileOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const newTextOpacity = useTransform(scrollYProgress, [0.2, 0.3], [0, 1]);
  const newTextY = useTransform(scrollYProgress, [0.2, 0.4], [50, -100]);
  const stageWrapY = useTransform(scrollYProgress, [0.3, 0.4], [0, -100]);
  const stageWrapOpacity = useTransform(scrollYProgress, [0.3, 0.4], [1, 0.4]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative w-full min-h-screen pt-16 sm:pt-24"
    >
      <motion.div
        style={{ y: stageWrapY, opacity: stageWrapOpacity }}
        className="absolute inset-0"
      >
        {/*Background image for Home Page*/}
        {id == "home" && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center"
            style={{
              opacity: textOpacity,
              backgroundImage: `url(${leaf})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              width: "80%",
              height: "80%",
              maxWidth: "600px",
              maxHeight: "600px",
            }}
          />
        )}
        {/* Initial Text */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="z-20 flex items-center justify-center w-full h-full mt-[30px] sm:mt-[30px]"
        >
          <div className="max-w-4xl px-4 mx-auto text-center sm:px-6">
            {title && <h1 className={styles?.titleElement}>{title}</h1>}

            {subtext && (
              <span className={styles?.subTextElement}>{subtext}</span>
            )}

            {description && (
              <motion.p
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.3,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100,
                }}
                className="z-30 w-full max-w-sm mx-auto px-4 mt-8 sm:mt-12 text-center sm:max-w-md md:max-w-2xl sm:px-6 pb-16 sm:pb-20"
              >
                <p className={styles?.descElement}>{description}</p>
              </motion.p>
            )}
            {/* {stats && (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 sm:gap-8 mt-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="p-4 border sm:p-6 rounded-2xl bg-white/5 backdrop-blur-lg border-white/10"
          >
            <h4 className="mb-1 text-2xl font-light sm:mb-2 sm:text-3xl">
              <p>{stat.value}</p>
            </h4>
            <p className="text-sm text-gray-400 sm:text-base">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    )} */}
          </div>
        </motion.div>

        {/* Content Container - Modified for better mobile spacing */}
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-[400px] xs:mt-[450px] sm:mt-[400px]">
          {/* Mobile Image */}
          <motion.div
            style={{
              opacity: mobileOpacity,
              y: mobileY,
            }}
            className="z-10 w-full max-w-sm px-4 mb-4 sm:max-w-md md:max-w-2xl sm:px-6 sm:mb-8"
          >
            <motion.img
              src={image}
              alt={title}
              className="w-full h-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Description Text - Added padding at bottom for better spacing */}
        </div>
      </motion.div>
    </section>
  );
};

const App = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const scrollValue = useMotionValue(0);
  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!email) {
      setError("Enter email id");
      return;
    }

    if (!validateEmail(email)) {
      setError("Enter a valid email id");
      return;
    }

    // Clear any previous errors
    setError("");

    // Start submitting
    setIsSubmitting(true);

    try {
      // Add email to Firestore
      await db.collection("PegionPostSubscibers").add({
        email: email,
        submittedAt: new Date(),
      });

      // Successfully submitted
      setIsSubmitted(true);
    } catch (err) {
      console.error("Error submitting email:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleRequestDemoClick = () => {
    animate(scrollValue, 1200, {
      duration: 2,
      ease: [0.42, 0, 0.58, 1],
    });
  };

  const sections = [
    {
      id: "home",
      title: "Creativity",
      subtext: "Beyond Limits",
      description:
        "Pigeon Post is built for boundless. For creators who want to break through barriers and redefine what's possible.",
      image: mobileDuo,
      styles: {
        titleElement:
          "font-dm-sans text-7xl md:text-8xl lg:text-[156px] font-thin leading-tight text-[#60A5FA] sm:font-normal font-bold typing-animation",
        subTextElement:
          "font-dm-sans text-5xl md:text-4xl lg:text-8xl font-normal",
        descElement: "font-dm-sans text-[20px] lg:text-[4xl]",
      },
    },
    // {
    //   id: "homeDesc",
    //   description:
    //     "Pigeon Post is built for boundless. For creators who want to break through barriers and redefine what's possible.",

    //   styles: {
    //     descElement:
    //       "font-dm-sans text-[32px] md:text-[48px] text-center max-w-[90%] sm:max-w-[80%] md:max-w-[60%] px-4",
    //   },
    // },

    {
      id: "platform",
      title: "One Platform",
      subtext: "Infinite Potential",
      description:
        "Experience limitless possibilities within a single platform. Create, collaborate, and innovate without boundaries.",
      image: mobileDuo2,
      stats: [
        { value: "100+", label: "Creative Tools" },
        { value: "50M+", label: "Projects Created" },
        { value: "Global", label: "Community" },
      ],
      styles: {
        titleElement:
          "font-dm-sans text-7xl md:text-8xl lg:text-[136px] font-thin leading-tight text-[#60A5FA] sm:font-normal font-bold",
        subTextElement:
          "font-dm-sans text-7xl md:text-4xl lg:text-8xl font-normal ",
        descElement: "font-dm-sans text-[20px] lg:text-[4xl]",
      },
    },
    {
      id: "future",
      title: "Not Just a Platform",
      subtext: "A New Era",
      description:
        "A place where creators write the future, together. Welcome to the next generation of creativity.",
      image: mobileDuo3,
      stats: [
        { value: "Next-Gen", label: "Technology" },
        { value: "AI-Powered", label: "Creation" },
        { value: "Unlimited", label: "Potential" },
      ],
      styles: {
        titleElement:
          "font-dm-sans text-6xl md:text-4xl lg:text-8xl font-normal text-[#60A5FA] mt-4 ",
        subTextElement:
          "font-dm-sans text-6xl md:text-8xl lg:text-[156px] font-thin leading-tight sm:font-normal font-bold",
        descElement: "font-dm-sans text-[20px] lg:text-[4xl]",
      },
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 " />

      {/* Header working */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-2 sm:px-6 sm:py-4"
      >
        <nav className="mx-auto max-w-7xl">
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 sm:p-5 z-50 backdrop-blur-sm">
            {/* Logo */}
            <div
              className="font-fingerPaint text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-[#735CDD] via-[#65A7F5] to-[#FFDB00]
 bg-clip-text text-transparent"
            >
              Pigeon Post
            </div>

            {/* Button */}
            <motion.button
              // style={{ opacity: requestDemoOpacity }}
              onClick={handleRequestDemoClick}
              className="font-lato border border-white px-2 py-1 sm:px-3 sm:py-2 rounded hover:bg-white hover:text-black transition-colors text-base sm:text-lg md:text-xl"
            >
              Request Demo
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Continuing from the previous part... */}

      <main>
        {/* Main Sections */}
        {sections.map((section, index) => (
          <ScrollSection key={section.id} {...section} index={index} />
        ))}

        {/* Join Section */}
        <section
          id="join"
          className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 overflow-hidden"
        >
          {/* Animated SVG Background */}

          <motion.div
            className="relative w-full max-w-4xl z-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col items-center px-4">
              {/* Heading */}
              <h2 className="font-dm-sans text-5xl md:text-5xl lg:text-6xl font-normal text-center mb-8 md:mb-12">
                <span className="text-[#60A5FA]">Stay up-to-date </span>with
                updates
              </h2>

              {/* Subscription Box */}
              {!isSubmitted ? (
                <div className="w-full max-w-2xl mx-auto mt-8">
                  <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col md:flex-row gap-4"
                  >
                    <div className="w-full md:flex-grow bg-gray-800/30 backdrop-blur-sm rounded-2xl p-2 border border-white/70">
                      <input
                        type="text"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent px-6 py-3 text-lg outline-none placeholder:text-gray-400"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="font-dm-sans bg-white text-black px-6 py-3 rounded-2xl text-lg font-medium whitespace-nowrap hover:bg-gray-200 transition-colors"
                      whileHover={{
                        backgroundColor: "rgba(229, 231, 235, 1)",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {isSubmitting ? "Subscribing..." : "Subscribe"}
                    </motion.button>
                  </form>

                  {/* Error Message */}
                  {error && (
                    <motion.p
                      className="text-red-400 text-base mt-4 text-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.p>
                  )}
                </div>
              ) : (
                // Success Message
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-2xl mx-auto bg-gray-800/30 backdrop-blur-sm rounded-2xl p-12 border border-white/70 text-center"
                >
                  <motion.svg
                    className="mx-auto mb-6"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M22 11.08V12a10 10 0 11-5.93-9.14"
                    />
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M22 4L12 14.01l-3-3"
                    />
                  </motion.svg>
                  <p className="text-3xl md:text-4xl font-dm-sans">
                    Thanks for subscribing!
                  </p>
                  <p className="mt-4 text-gray-300">
                    We'll keep you updated with the latest news.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative px-4 py-8 mt-12 sm:px-6 sm:py-12 sm:mt-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4 sm:gap-12">
              {/* Brand Column */}
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2"
                >
                  <h3 className="font-fingerPaint text-xl bg-gradient-to-r from-[#735CDD] via-[#65A7F5] to-[#FFDB00] bg-clip-text text-transparent">
                    Pigeon Post
                  </h3>
                </motion.div>
                <p className="text-sm text-gray-400">
                  Empowering creators to break through barriers and redefine
                  what's possible.
                </p>
              </div>

              {/* Resources */}
              <div>
                <h3 className="mb-4 text-lg font-medium">Legal</h3>
                <ul className="space-y-2">
                  {["Privacy Policy", "Terms of Service", "Security"].map(
                    (item) => (
                      <li key={item}>
                        <motion.a
                          href="#"
                          whileHover={{ x: 5 }}
                          className="text-sm text-gray-400 transition-colors hover:text-white"
                        >
                          {item}
                        </motion.a>
                      </li>
                    )
                  )}
                </ul>
              </div>
              {/* Resources */}
              <div>
                <h3 className="mb-4 text-lg font-medium">Resources</h3>
                <ul className="space-y-2">
                  {["Documentation", "Tutorials", "Blog", "Support"].map(
                    (item) => (
                      <li key={item}>
                        <motion.a
                          href="#"
                          whileHover={{ x: 5 }}
                          className="text-sm text-gray-400 transition-colors hover:text-white"
                        >
                          {item}
                        </motion.a>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="mb-4 text-lg font-medium">Connect</h3>
                <ul className="space-y-2">
                  {["Twitter", "Discord", "GitHub", "LinkedIn"].map((item) => (
                    <li key={item}>
                      <motion.a
                        href="#"
                        whileHover={{ x: 5 }}
                        className="text-sm text-gray-400 transition-colors hover:text-white"
                      >
                        {item}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="pt-8 mt-12 text-sm text-center text-gray-400 border-t border-white/10">
              <p>© 2025 Pigeon Post. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;

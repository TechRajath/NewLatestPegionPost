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

const TextReveal = ({ children }) => (
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, type: "spring" }}
  >
    {children}
  </motion.div>
);

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

  // Stage 1
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const mobileY = useTransform(scrollYProgress, [0, 0.2, 0.4], [100, 0, -100]);
  const mobileOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const newTextOpacity = useTransform(scrollYProgress, [0.2, 0.3], [0, 1]);
  const newTextY = useTransform(scrollYProgress, [0.2, 0.4], [50, -100]);
  const stageWrapY = useTransform(scrollYProgress, [0.3, 0.4], [0, -100]);
  const stageWrapOpacity = useTransform(scrollYProgress, [0.3, 0.4], [1, 0]);

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
        {/*Background image for Home Page Goes here ............*/}
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
            {/* <span className="block mb-2 text-sm tracking-wider text-gray-400 uppercase sm:mb-4">
              {subtext}
            </span> */}
            {title && <h1 className={styles?.titleElement}>{title}</h1>}
            {subtext && (
              <span className={styles?.subTextElement}>{subtext}</span>
            )}
            {/* {stats && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 sm:gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="p-4 border sm:p-6 rounded-2xl bg-white/5 backdrop-blur-lg border-white/10"
                  >
                    <h4 className="mb-1 text-2xl font-light sm:mb-2 sm:text-3xl">
                      <GradientText>{stat.value}</GradientText>
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

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-[300px] sm:mt-[400px]">
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

          {/* Description Text */}
          {description && (
            <motion.div
              style={{ opacity: newTextOpacity, y: newTextY }}
              className="z-30 w-full max-w-sm px-4 mt-4 text-center sm:max-w-md md:max-w-2xl sm:px-6 sm:mt-8"
            >
              <p className={styles?.descElement}>{description}</p>
            </motion.div>
          )}
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
          "font-dm-sans text-6xl md:text-8xl lg:text-[156px] font-thin leading-tight",
        subTextElement:
          "font-dm-sans text-4xl md:text-4xl lg:text-8xl font-normal",
        descElement: "font-dm-sans text-2xl lg:text-[4xl]",
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
          "font-dm-sans text-5xl md:text-8xl lg:text-[136px] font-thin leading-tight",
        subTextElement:
          "font-dm-sans text-4xl md:text-4xl lg:text-8xl font-normal",
        descElement: "font-dm-sans text-2xl lg:text-[4xl]",
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
          "font-dm-sans text-4xl md:text-4xl lg:text-8xl font-normal",
        subTextElement:
          "font-dm-sans text-6xl md:text-8xl lg:text-[156px] font-thin leading-tight",
        descElement: "font-dm-sans text-2xl lg:text-[4xl]",
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
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 sm:p-5 z-50">
            {/* Logo */}
            <div className="font-fingerPaint text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-[#9B59B6] via-[#3498DB] to-[#E74C3C] bg-clip-text text-transparent">
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
          className="relative flex items-center justify-center min-h-screen px-4 pt-16 sm:px-6 sm:pt-24"
        >
          <motion.div
            className="relative w-full min-h-screen flex items-center justify-center px-4 sm:px-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl px-4">
              {/* Heading */}
              <h2 className="font-dm-sans text-[16px] sm:text-[24px] md:text-[32px] lg:text-[46px] font-normal text-center mb-6 sm:mb-8">
                Stay up-to-date with updates
              </h2>

              {/* Subscription Box */}
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="w-full">
                  <div className="w-full bg-[#666666] rounded-full p-2 flex items-center">
                    {/* Email Input */}
                    <input
                      type="text"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="font-dm-sans w-full bg-transparent px-6 py-3  rounded-full outline-none  placeholder:text-[15px] lg:placeholder:text-[20px]"
                    />

                    {/* Subscribe Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="font-dm-sans bg-black text-white px-6 py-3 rounded-full text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px]"
                    >
                      {isSubmitting ? "Subscribing..." : "Subscribe"}
                    </button>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <p className="font-dm-sans text-red-500 text-[12px] sm:text-[14px] md:text-[16px] mt-2 text-center">
                      {error}
                    </p>
                  )}
                </form>
              ) : (
                // Success Message
                <p className="font-dm-sans text-white text-[24px] sm:text-[32px] md:text-[40px] text-center">
                  Thanks for subscribing!
                </p>
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
                  <h3 className="font-fingerPaint text-xl bg-gradient-to-r from-[#9B59B6] via-[#3498DB] to-[#E74C3C] bg-clip-text text-transparent">
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

import "./App.css";
import { FaTwitter, FaDiscord, FaGithub, FaLinkedin } from "react-icons/fa";
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
        {/* Initial Text */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="flex items-center justify-center w-full h-full mt-[30px] sm:mt-[30px]"
        >
          <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 z-20">
            {title && <p className={styles?.titleElement}>{title}</p>}

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
          </div>
        </motion.div>
        {/*Background image for Home Page*/}
        {id == "home" && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center" // Use z-0 instead of z-[-1]
            style={{
              opacity: textOpacity,
              backgroundImage: `url(${leaf})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              width: "50%",
              height: "50%",
              maxWidth: "600px",
              maxHeight: "600px",
            }}
          />
        )}
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

const App1 = () => {
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
        "Pigeon Post is built for boundless. For creators who want to break through barriers",
      image: mobileDuo,
      styles: {
         titleElement:
          "font-dm-sans text-7xl md:text-8xl lg:text-[156px] text-textColorCustom",
        subTextElement:
          "font-dm-sans text-5xl md:text-4xl lg:text-8xl font-normal text-textColorCustom",
        descElement:
          "font-dm-sans text-[20px] lg:text-[4xl] text-textColorCustom",
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
      description: (
        <>
          Everything you need, together in one place. No friction, no barriers{" "}
          <span className="text-2xl md:text-2xl lg:text-3xl block w-full">
            -just the space to{" "}
            <span className=" text-4xl sm:text-3xl md:text-3xl lg:text-5xl">
              create{" "}
            </span>
            your best work.
          </span>
        </>
      ),

      image: mobileDuo2,
      stats: [
        { value: "100+", label: "Creative Tools" },
        { value: "50M+", label: "Projects Created" },
        { value: "Global", label: "Community" },
      ],
      styles: {
        titleElement:
          "font-dm-sans text-6xl md:text-8xl lg:text-[136px] text-textColorCustom",
        subTextElement:
          "font-dm-sans text-4xl md:text-4xl lg:text-8xl  mt-4 text-textColorCustom",
        descElement:
          "font-dm-sans text-[20px] lg:text-[4xl] text-textColorCustom",
      },
    },
    {
      id: "future",
      title: "Not Just a Platform",
      subtext: "A New Era",
      description: (
        <>
          A place where creators write the future, together;{" "}
          <span className="text-2xl md:text-2xl lg:text-3xl block w-full">
            Welcome to the next generation of creativity
          </span>
        </>
      ),
      image: mobileDuo3,
      stats: [
        { value: "Next-Gen", label: "Technology" },
        { value: "AI-Powered", label: "Creation" },
        { value: "Unlimited", label: "Potential" },
      ],
      styles: {
        titleElement:
          "font-dm-sans text-4xl md:text-4xl lg:text-7xl  mt-4 text-textColorCustom",
        subTextElement:
          "font-dm-sans text-6xl md:text-8xl lg:text-[136px] text-textColorCustom",
        descElement:
          "font-dm-sans text-[20px] lg:text-[4xl] text-textColorCustom",
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
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 sm:p-5 z-50 ">
            {/* Logo */}
            <div
              className="font-fingerPaint text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-[#735CDD] via-[#65A7F5] to-[#FFDB00]
 bg-clip-text text-transparent pb-2"
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
          <motion.div
            className="relative w-full min-h-screen flex items-center justify-center px-4 sm:px-8"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
            }}
          >
            <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl px-4">
              {/* Heading */}
              <h2 className="font-dm-sans text-[16px] sm:text-[24px] md:text-[32px] lg:text-[46px] font-normal text-center mb-6 sm:mb-8 text-textColorCustom">
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
                      className="font-dm-sans w-full bg-transparent px-6 py-3  rounded-full outline-none  placeholder:text-[15px] lg:placeholder:text-[20px] placeholder:font-dm-sans"
                    />

                    {/* Subscribe Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="font-dm-sans bg-black text-textColorCustom px-6 py-3 rounded-full text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px]"
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
        <footer className="relative px-4 py-8 mt-12 sm:px-6 sm:py-12 sm:mt-24 bg-black text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 sm:gap-12">
          {/* Company Description */}
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2"
            >
              <h3 className="font-fingerPaint text-xl font-bold bg-gradient-to-r from-[#735CDD] via-[#65A7F5] to-[#FFDB00] bg-clip-text text-transparent">
                Pigeon Post
              </h3>
            </motion.div>
            <p className="text-sm text-gray-400">
              Empowering creators to break through barriers and redefine what's possible.
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 text-lg font-medium">Legal</h3>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms of Service"].map((item) => (
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

          {/* Social Links */}
          <div>
            <h3 className="mb-4 text-lg font-medium">Connect with us</h3>
            <div className="flex space-x-4">
              {[
                { name: "Twitter", icon: <FaTwitter />, link: "#" },
                { name: "Discord", icon: <FaDiscord />, link: "#" },
                { name: "GitHub", icon: <FaGithub />, link: "#" },
                { name: "LinkedIn", icon: <FaLinkedin />, link: "#" },
              ].map((social) => (
                <motion.a
                  key={social.name}
                  href={social.link}
                  whileHover={{ scale: 1.2 }}
                  className="text-gray-400 hover:text-white text-2xl transition-colors"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* SVG Animation */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-0 right-0 w-16 h-16 opacity-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full text-gray-500"
          >
            <path d="M3 3h18v18H3z" />
          </svg>
        </motion.div>

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

export default App1;

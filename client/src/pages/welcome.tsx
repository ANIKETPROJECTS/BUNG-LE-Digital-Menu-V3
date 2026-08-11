const googleReviewImg =
  "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092671/tarang-assets/Google_Review__1__1773512308220.png";
const spoonForkImg =
  "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092667/tarang-assets/19_1773512274982.png";
const welcomeBackground = "/welcome-custom-bg.png";
import { useLocation } from "wouter";
import { useWelcomeAudio } from "../hooks/useWelcomeAudio";
import { MediaPreloader } from "../components/media-preloader";
import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
const welcomeLogo = "/welcome-custom-logo.png";
const instaImg =
  "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093081/tarang-assets/instagram__2__1773345405292.png";
const fbImg =
  "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092684/tarang-assets/facebook__2__1773345408410.png";
const ytImg =
  "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093085/tarang-assets/youtube_1773345412112.png";
const mapsImg =
  "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093082/tarang-assets/logo__1__1773390711534.png";
const callImg =
  "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092681/tarang-assets/call_1773390891033.png";
const mailImg =
  "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092684/tarang-assets/communication_1773390476300.png";
const whatsappImg =
  "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092680/tarang-assets/apple_1773515172898.png";
const reservationImg =
  "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092681/tarang-assets/booking__1__1776693914078.png";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { ReservationModal } from "@/components/hamburger-menu";

interface SocialLinks {
  instagram: string;
  facebook: string;
  youtube: string;
  googleReview: string;
  locate: string;
  call: string;
  whatsapp: string;
  email: string;
  website: string;
}

interface WelcomeScreenUI {
  logoUrl: string;
  buttonText: string;
}

const DEFAULT_LINKS: SocialLinks = {
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  youtube: "https://youtube.com",
  googleReview: "https://g.page/r/",
  locate: "https://maps.google.com",
  call: "tel:+91",
  whatsapp: "https://wa.me/91",
  email: "mailto:info@bungle.com",
  website: "https://www.bungle.com",
};

const DEFAULT_WELCOME_UI: WelcomeScreenUI = {
  logoUrl: "",
  buttonText: "EXPLORE OUR MENU",
};

export default function Welcome() {
  const [, setLocation] = useLocation();
  const { playWelcomeAudio } = useWelcomeAudio();
  const [mediaReady, setMediaReady] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const { t, language } = useLanguage();

  const { data: linksData } = useQuery<SocialLinks>({
    queryKey: ["/api/social-links"],
  });

  const { data: welcomeUIData } = useQuery<WelcomeScreenUI>({
    queryKey: ["/api/welcome-screen-ui"],
  });

  const links: SocialLinks = linksData ?? DEFAULT_LINKS;
  const welcomeUI: WelcomeScreenUI = welcomeUIData ?? DEFAULT_WELCOME_UI;
  const logoSrc = welcomeLogo;

  // Details are collected on the menu page itself (via CustomerGate), not
  // before entering it — so tapping "Explore our menu" goes straight in.
  const handleExploreMenu = () => {
    playWelcomeAudio();
    setLocation("/menu");
  };

  const handleSocialClick = useCallback((url: string) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) {
      (document.activeElement as HTMLElement)?.blur();
    }
  }, []);

  return (
    <div
      className="bb-bg h-screen w-full overflow-hidden relative flex flex-col"
      style={{
        backgroundColor: "#090B0B",
        backgroundImage: `url(${welcomeBackground})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <MediaPreloader onComplete={() => setMediaReady(true)} />
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: "rgba(0, 0, 0, 0.24)",
          backdropFilter: "blur(1.2px)",
          WebkitBackdropFilter: "blur(1.2px)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center w-full flex-1 px-0 pt-0 pb-0 gap-3 justify-start">
        {/* Logo */}
        <div
          className="w-full flex justify-center flex-shrink-0"
          style={{ paddingTop: "40px", maxHeight: "310px", overflow: "hidden" }}
        >
          <img
            src={logoSrc}
            alt="Bung-le"
            style={{
              width: "min(560px, 94vw)",
              maxWidth: "100%",
              maxHeight: "340px",
              objectFit: "contain",
              filter: "none",
            }}
          />
        </div>

        {/* Explore button */}
        <button
          onClick={handleExploreMenu}
          className="btn-explore w-full max-w-xs py-4 font-semibold rounded-full transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
          style={{ marginTop: "-10px" }}
          data-testid="button-explore-menu"
        >
          <span>
            {language === "en"
              ? welcomeUI.buttonText || t.exploreMenu
              : t.exploreMenu}
          </span>
          <span
            className="btn-icon w-8 h-8 flex-shrink-0 inline-block"
            style={{
              backgroundColor: "#E49B1D",
              WebkitMask: `url(${spoonForkImg}) no-repeat center / contain`,
              mask: `url(${spoonForkImg}) no-repeat center / contain`,
            }}
          />
        </button>

        {/* Social and contact links */}
        <div
          className="w-full max-w-xs flex flex-col items-center gap-4"
          style={{ marginTop: "20px", color: "#D8C28A" }}
        >
          <p className="text-xs font-medium tracking-widest">
            {t.followOurSocials}
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleSocialClick(links.instagram)}
              className="transition-opacity hover:opacity-80"
              data-testid="button-social-instagram"
            >
              <img
                src={instaImg}
                alt="Instagram"
                className="w-10 h-10 rounded-xl object-contain"
              />
            </button>
            <button
              onClick={() => handleSocialClick(links.facebook)}
              className="transition-opacity hover:opacity-80"
              data-testid="button-social-facebook"
            >
              <img
                src={fbImg}
                alt="Facebook"
                className="w-10 h-10 rounded-xl object-contain"
              />
            </button>
            <button
              onClick={() => handleSocialClick(links.youtube)}
              className="transition-opacity hover:opacity-80"
              data-testid="button-social-youtube"
            >
              <img
                src={ytImg}
                alt="YouTube"
                className="w-10 h-10 rounded-xl object-contain"
              />
            </button>
          </div>

          {/* Divider */}
          <div
            className="social-card-divider"
            style={{
              width: "80%",
              height: "1px",
              background: "rgba(3,1,1,0.2)",
            }}
          />

          {/* Click to Rate Us */}
          <p className="text-xs font-medium tracking-widest">
            {t.clickToRateUs}
          </p>
          <div style={{ overflow: "hidden", height: "62px" }}>
            <button
              onClick={() => handleSocialClick(links.googleReview)}
              className="hover:opacity-80 transition-opacity"
              data-testid="button-google-review"
            >
              <img
                src={googleReviewImg}
                alt="Rate us on Google"
                style={{ width: "188px", display: "block", marginTop: "-66px" }}
              />
            </button>
          </div>

          {/* Divider */}
          <div
            className="social-card-divider"
            style={{
              width: "80%",
              height: "1px",
              background: "rgba(3,1,1,0.2)",
            }}
          />

          {/* Connect With Us */}
          <p className="text-xs font-medium tracking-widest">
            {t.connectWithUs}
          </p>
          <div className="grid grid-cols-5 items-start justify-items-center gap-1 w-full">
            <button
              className="flex min-w-0 flex-col items-center gap-0.5 transition-opacity hover:opacity-80"
              onClick={() => handleSocialClick(links.locate)}
              data-testid="button-connect-locate"
            >
              <img
                src={mapsImg}
                alt="Google Maps"
                className="w-10 h-10 rounded-lg object-cover"
              />
                <span className="text-xs font-semibold">
                {t.locate}
              </span>
            </button>
            <button
              className="flex min-w-0 flex-col items-center gap-0.5 transition-opacity hover:opacity-80"
              onClick={() => handleSocialClick(links.call)}
              data-testid="button-connect-call"
            >
              <img
                src={callImg}
                alt="Call"
                className="w-10 h-10 rounded-full object-cover"
              />
                <span className="text-xs font-semibold">
                {t.call}
              </span>
            </button>
            <button
              className="flex min-w-0 flex-col items-center gap-0.5 transition-opacity hover:opacity-80"
              onClick={() => handleSocialClick(links.whatsapp)}
              data-testid="button-connect-chat"
            >
              <img
                src={whatsappImg}
                alt="WhatsApp"
                className="w-10 h-10 rounded-xl object-cover"
              />
                <span className="text-xs font-semibold">
                {t.chat}
              </span>
            </button>
            <button
              className="flex min-w-0 flex-col items-center gap-0.5 transition-opacity hover:opacity-80"
              onClick={() => handleSocialClick(links.email)}
              data-testid="button-connect-email"
            >
              <img
                src={mailImg}
                alt="Email"
                className="w-10 h-10 rounded-lg object-cover"
              />
                <span className="text-xs font-semibold">
                {t.email}
              </span>
            </button>
            <button
              className="flex min-w-0 flex-col items-center gap-0.5 transition-opacity hover:opacity-80"
              onClick={() => setShowReservation(true)}
              data-testid="button-connect-reservation"
            >
              <img
                src={reservationImg}
                alt="Reservation"
                className="w-10 h-10 rounded-xl object-contain"
              />
                <span className="text-xs font-semibold">
                {t.book}
              </span>
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showReservation && (
          <ReservationModal onClose={() => setShowReservation(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

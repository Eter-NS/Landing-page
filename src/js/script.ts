import "../scss/main.scss";
import buttonListening from "./components/Listeners/menuHamburgerListener";
import moveToSection from "./components/Listeners/moveToSection";
import IntersectionObserverForSections from "./components/Observers/intersectionListenerForSections";
import alwaysActualYear from "./components/alwaysActualYear";
import fadingNavAfterMovingDownwards from "./components/Listeners/fadingNavAfterMovingDownwards";
import { FormValidation } from "./components/Listeners/formValidation";
// import resizeObserverForImages from "./components/Observers/resizeObserverForImages";

// resizeObserverForImages();

new FormValidation("#contactForm");
buttonListening(".navbar__hamburger", ".navbar__list");
alwaysActualYear();
moveToSection();
IntersectionObserverForSections([".about_me", ".contact"]);
fadingNavAfterMovingDownwards.start();

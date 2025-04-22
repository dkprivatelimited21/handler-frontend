import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const hasScrolledRef = useRef({}); // track scrolled pages

  useEffect(() => {
    const excludedPaths = ["/profile", "/dashboard"];
    const isExcluded = excludedPaths.some((path) => pathname.startsWith(path));
    const alreadyScrolled = hasScrolledRef.current[pathname];
    const isScrollable = document.body.scrollHeight > window.innerHeight;

    if (!isExcluded && !alreadyScrolled && isScrollable) {
      window.scrollTo({ top: 0 });
      hasScrolledRef.current[pathname] = true;
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;

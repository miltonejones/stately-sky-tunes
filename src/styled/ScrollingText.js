

import Marquee from "react-fast-marquee";

const ScrollingText = ({ scrolling, children }) => {
  if (scrolling) {
    return (
      <Marquee play gradientColor="#222">
        {children}
      </Marquee>
    );
  }
  return children;
};
 
export default ScrollingText;

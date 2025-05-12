import React, { useState, useEffect } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);

  useEffect(() => {
    const mobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    if (mobileOrTablet) return;

    const mouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
    };

    const mouseLeave = () => setHidden(true);
    const mouseEnter = () => setHidden(false);
    const mouseDown = () => setClicked(true);
    const mouseUp = () => setClicked(false);

    const handleLinkHoverStart = (e: MouseEvent) => {
      // @ts-ignore
      const target = e.target as HTMLElement;
      const isLink = target.tagName.toLowerCase() === 'a' || 
                    target.tagName.toLowerCase() === 'button' ||
                    target.closest('a') ||
                    target.closest('button');
      
      if (isLink) {
        setLinkHovered(true);
      }
    };

    const handleLinkHoverEnd = () => {
      setLinkHovered(false);
    };

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseleave', mouseLeave);
    document.addEventListener('mouseenter', mouseEnter);
    document.addEventListener('mousedown', mouseDown);
    document.addEventListener('mouseup', mouseUp);
    document.addEventListener('mouseover', handleLinkHoverStart);
    document.addEventListener('mouseout', handleLinkHoverEnd);

    return () => {
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseleave', mouseLeave);
      document.removeEventListener('mouseenter', mouseEnter);
      document.removeEventListener('mousedown', mouseDown);
      document.removeEventListener('mouseup', mouseUp);
      document.removeEventListener('mouseover', handleLinkHoverStart);
      document.removeEventListener('mouseout', handleLinkHoverEnd);
    };
  }, []);

  // Don't render on mobile devices
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed pointer-events-none z-50 rounded-full transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-[width,height] duration-100 ${
          hidden ? 'opacity-0' : 'opacity-100'
        } ${clicked ? 'w-6 h-6' : linkHovered ? 'w-12 h-12' : 'w-6 h-6'}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          backgroundColor: 'white',
          transition: 'opacity 0.15s ease, width 0.2s ease, height 0.2s ease, background-color 0.2s ease',
        }}
      ></div>
      <div
        className={`fixed pointer-events-none z-50 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${
          hidden ? 'opacity-0' : 'opacity-70'
        } w-8 h-8 border border-white`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transition: 'opacity 0.3s ease, transform 0.2s ease-out, width 0.2s ease, height 0.2s ease',
          transitionDelay: '0.05s',
          transform: `translate(-50%, -50%) scale(${linkHovered ? 1.5 : 1})`,
          opacity: linkHovered ? 0.5 : 0.2,
        }}
      ></div>
    </>
  );
};

export default CustomCursor;
const LottieAnimation = () => {
  const container = useRef(null);

  useEffect(() => {
    lottie.loadAnimation({
      container: container.current,
      animationData: animationData, // Pass animation data here
      renderer: 'svg', // Use 'svg', 'canvas', 'html' to render
      loop: false, // Optional
      autoplay: true, // Optional
    });

    // Clean up
    return () => {
      lottie.destroy();
    };
  }, []);

  return <div ref={container} />;
};

export default LottieAnimation;

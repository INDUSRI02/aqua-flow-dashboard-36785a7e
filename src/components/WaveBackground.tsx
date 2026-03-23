const WaveBackground = ({ className = "" }: { className?: string }) => (
  <div className={`absolute inset-0 overflow-hidden ${className}`}>
    <svg
      className="absolute bottom-0 w-full animate-wave"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
    >
      <path
        d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z"
        fill="hsla(199, 89%, 48%, 0.08)"
      />
    </svg>
    <svg
      className="absolute bottom-0 w-full animate-wave"
      style={{ animationDelay: "0.5s" }}
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
    >
      <path
        d="M0,80 C480,20 960,100 1440,40 L1440,120 L0,120 Z"
        fill="hsla(142, 71%, 45%, 0.06)"
      />
    </svg>
  </div>
);

export default WaveBackground;

import "./Arrow.css";

const Arrow = ({ direction, color, w = "100%", h = "100%" }: any) => {
  return (
    <>
      <svg
        width={w}
        height={h}
        className={`margin-arrow ${direction}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100.66 100.71"
      >
        <g id="Calque_2">
          <g id="Calque_1-2">
            <path
              stroke={color}
              className="cls-1-arrow-big"
              d="M100 50.35H0m50-50l49.91 50-50 50M99.94 50.35H0"
            ></path>
            <path
              stroke={color}
              className="cls-1-arrow-big"
              d="M49.97.35l49.97 50-49.97 50"
            ></path>
          </g>
        </g>
      </svg>
    </>
  );
};

export default Arrow;

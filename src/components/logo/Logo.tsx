import { motion } from "framer-motion";

export interface ILogoProps {
  color?: string;
  w?: string;
  h?: string;
  mode?: "full" | "mini";
  enableMotion?: boolean;
}

const duration = 1.8;

const Logo = ({
  color = "#eee",
  w = "100%",
  h = "100%",
  mode = "full",
  enableMotion = null,
}: ILogoProps) => {
  if (mode === "full") {
    return (
      <svg width={w} height={h} viewBox="0 0 3086.38 604.17">
        <path
          d="M1849.19,721.91H-1237.19V117.74H1849.19ZM-1176.27,661H1788.27V178.66H-1176.27Z"
          transform="translate(1237.19 -117.74)"
          fill={color}
        />
        <path
          d="M-978.28,270.57c47.34,0,85.29,14.07,113.87,41.79s42.64,63.54,42.64,107.47S-835.84,500-864.41,527.71s-66.53,41.37-113.87,41.37h-115.13V270.57Zm-41.36,68.66V500.42h41.36c52.46,0,79.75-28.14,79.75-80.59s-27.29-80.6-79.75-80.6Z"
          transform="translate(1237.19 -117.74)"
          fill={color}
        />
        <path
          d="M-685.3,270.57c33.69,0,60.13,9,80.17,27.3s30.28,42.21,30.28,71.63c0,35.4-17.91,64-48.61,80.6l61.4,119h-83.58l-52.88-104.9h-13.22v104.9h-73.77V270.57Zm-26.44,68.66v60.55h26.44c23.46,0,35-10.23,35-30.28s-11.51-30.27-35-30.27Z"
          transform="translate(1237.19 -117.74)"
          fill={color}
        />
        <path
          d="M-356.08,270.57v68.66h-104v42.64h88.28v68.66h-88.28v49.89h104.05v68.66H-533.9V270.57Z"
          transform="translate(1237.19 -117.74)"
          fill={color}
        />
        <path
          d="M-143.27,270.57-30.69,569.08H-110l-20-56.29H-239.22l-20,56.29h-79.32L-226,270.57Zm-41.37,87-5.54,17.48-26.44,75.05h64l-26.44-75.05Z"
          transform="translate(1237.19 -117.74)"
          fill={color}
        />
        <path
          d="M325,270.57V569.08H251.19V404.9l-8.52,29.43L192.35,569.08H128.81L78.49,434.33,70,404.9V569.08H-3.82V270.57H82.75l72.5,171.86,5.11,16.2,5.55-16.2L238.4,270.57Z"
          transform="translate(1237.19 -117.74)"
          fill={color}
        />
        <path
          d="M551.84,270.57c33.69,0,60.13,9.38,80.18,27.72s30.27,42.65,30.27,72.5c0,29-10.23,52.88-30.27,72.06C612,461.62,585.11,471,551.84,471H523.27v98.08H449.5V270.57Zm-28.57,68.66v63.11h28.57c22.18,0,35-11.09,35-31.55,0-20.9-11.51-31.56-35-31.56Z"
          transform="translate(1237.19 -117.74)"
          fill={color}
        />
        <path
          d="M767.64,270.57V500.42H884.91v68.66h-191V270.57Z"
          transform="translate(1237.19 -117.74)"
          fill={color}
        />
        <path
          d="M1089.61,270.57l112.57,298.51h-79.32l-20-56.29H993.66l-20,56.29H894.29l112.58-298.51Zm-41.37,87-5.54,17.48-26.45,75.05h64l-26.44-75.05Z"
          transform="translate(1237.19 -117.74)"
          fill={color}
        />
        <path
          d="M1494.3,372.49h-80.59c-10.24-26.86-27.29-38.81-60.13-38.81-22.17,0-40.09,8.11-53.73,23.89-13.22,15.77-20,36.67-20,61.83q0,38.39,20.46,62.69c13.65,15.77,31.56,23.88,54.16,23.88,33.26,0,54.58-14.07,64.4-42.65h76.76c-15.79,71.22-62.27,111.3-141.16,111.3-44.35,0-80.59-14.5-109.17-43.49-28.14-29.43-42.21-66.52-42.21-111.73,0-44.78,14.07-81.88,42.21-110.87s64.4-43.5,108.32-43.5C1430.34,265,1477.67,307.25,1494.3,372.49Z"
          transform="translate(1237.19 -117.74)"
          fill={color}
        />
        <path
          d="M1705.41,270.57v68.66H1601.36v42.64h88.27v68.66h-88.27v49.89h104.05v68.66H1527.58V270.57Z"
          transform="translate(1237.19 -117.74)"
          fill={color}
        />
      </svg>
    );
  } else if (enableMotion) {
    return (
      <motion.svg
        width={w}
        height={h}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 771.11 565.26"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeOut",
          delay: 0.15,
        }}
      >
        <motion.circle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeOut",
            delay: 0,
          }}
          cx="105.55"
          cy="282.63"
          r="105.55"
          fill={color}
        />
        <motion.rect
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeOut",
            delay: 0.15,
          }}
          x="340.84"
          width="89.43"
          height="565.26"
          fill={color}
        />
        <motion.circle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeOut",
            delay: 0.3,
          }}
          cx="665.55"
          cy="282.63"
          r="105.55"
          fill={color}
        />
      </motion.svg>
    );
  } else {
    return (
      <svg
        width={w}
        height={h}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 771.11 565.26"
      >
        <circle cx="105.55" cy="282.63" r="105.55" fill={color} />
        <rect x="340.84" width="89.43" height="565.26" fill={color} />
        <circle cx="665.55" cy="282.63" r="105.55" fill={color} />
      </svg>
    );
  }
};

export default Logo;

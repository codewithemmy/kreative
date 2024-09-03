import React, { CSSProperties, ReactElement, ReactEventHandler } from "react";

interface CustomButtonProps {
  text: string;
  height?: string;
  type: "button" | "submit" | "reset" | undefined;
  onClick?: ReactEventHandler;
  fontSize?: string;
  width?: string;
  hover?: string;
  bgColor?: string;
  textColor?: string;
  border?: string;
  className?: string;
  disabled?: boolean;
  opacity?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  height,
  type,
  onClick,
  fontSize = "14px",
  width = "150px",
  hover = "#008000",
  bgColor = "#6C1EEB",
  textColor = "white",
  border,
  className,
  disabled,
  opacity,
}) => {
  const buttonStyle: CSSProperties = {
    backgroundColor: bgColor,
    color: textColor,
    padding: "10px",
    borderRadius: "17px",
    width: width,
    cursor: "pointer",
    fontFamily: "Open Sans",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: fontSize,
    border: `1px solid ${border}`,
    height: height,
    opacity: opacity,
  };

  const hoverStyle: CSSProperties = {
    backgroundColor: hover,
    color: textColor,
  };

  return (
    <div>
      <button
        style={buttonStyle}
        onClick={onClick}
        type={type}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
        className={className}
        disabled={disabled}
      >
        {text}
      </button>
    </div>
  );
};

export default CustomButton;

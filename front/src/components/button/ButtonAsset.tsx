interface ButtonProps {
    text: string;
    variant?: string;
    className?: string;
    size?: string;
  }
  
  interface ButtonStyleType {
    [key: string]: string;
  }
  
  export default function ButtonAsset({
    text,
    variant = "filled",
    className,
    size = "md",
    ...buttonAttribute
  }: ButtonProps & ButtonAttribute) {
    // 형태에 따른 버튼 css 설정 객체
    const buttonColors: ButtonStyleType = {
      filled: "bg-primary hover:bg-primary-hover disabled:bg-disabled text-white",
      outlined:
        "text-primary bg-white border border-primary hover:bg-secondary hover:text-white disabled:border-disabled disabled:text-disabled",
      text: "text-black bg-white hover:bg-[#ededed] disabled:text-disabled",
    };
  
    // 크기에 따른 버튼 css 설정 객체
    const buttonSizes: ButtonStyleType = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2",
      lg: "px-8 py-3",
    };
  
    return (
      <button
        {...buttonAttribute}
        className={`min-w-fit rounded-md ${buttonColors[variant]} ${buttonSizes[size]} ${className}`}
      >
        <span className="flex items-center justify-center">{text}</span>
      </button>
    );
  }
  
  export type InputAttribute = React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  
  export type ButtonAttribute = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
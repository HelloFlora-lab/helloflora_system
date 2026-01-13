import { ReactNode } from "react";

type LinkGroupProps = {
  children: ReactNode;
  header: string;
};

const LinkGroup = ({ children, header }: LinkGroupProps) => {
  return (
    <div className="w-full px-4 sm:w-1/2 lg:w-3/12 2xl:w-2/12">
      <div className="mb-5 w-full">
        <h4 className="mb-4 text-lg font-semibold text-theme-text-accent"> {header} </h4>
        <ul className="space-y-1">{children}</ul>
      </div>
    </div>
  );
};
export default LinkGroup;
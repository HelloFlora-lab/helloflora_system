import LocalizedClientLink from "@modules/common/components/localized-client-link";


type NavLinkProps = {
  label: string;
  link: string;
  title?: string;
};

const NavLink = ({ label, link, title }: NavLinkProps) => {
  return (
    <li>
      
       <LocalizedClientLink
        href={link}
        title={title}
        className="inline-block text-base leading-loose text-theme-text-accent-light underline-offset-2 hover:text-white hover:underline"
      >
        {label}
      </LocalizedClientLink>

    </li>
  );
};

export default NavLink;
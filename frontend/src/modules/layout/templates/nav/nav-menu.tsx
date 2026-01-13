"use client"
import { useTheme } from "@lib/context/theme-context";
import IconAIAgent from "@modules/ai/icon-agent";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import React from "react";

const MenuItems = [
  {
    name: "Flora AI",
    title: "Utilizza la nostra assistente AI per scegliere i fiori perfetti",
    url: "/flora-AI",
    icon: true,
  },
  { name: "Consigli", title: "Consigli di HelloFlora", url: "/blog", icon: false },
  { name: "FAQ", title: "FAQ, domande e risposte di HelloFlora", url: "/faq", icon: false },
  
];

const NavMenu = () => {


  const { theme } = useTheme();

  return (
    <ul className="block items-center lg:flex">
      {MenuItems.map((item) => (
        <li key={item.name}>
          <LocalizedClientLink
            href={item.url}
            className="py-2 lg:mx-5 text-base-semi capitalize text-theme-text-base hover:text-theme-accent"
            title={item.title}
          >
            {item.name}
            {item.icon && (
               <img
                data-src-template={`/images/AI_agent_${theme}.png`}
                data-src-default={`/images/AI_agent_${theme}.png`}
                src={`/images/AI_agent_${theme}.png`}
                alt={item.title}
                className="inline-block w-5 h-5 ml-2 align-middle"
              />
            )}
          </LocalizedClientLink>
        </li>
      ))}
    </ul>
  );
};

export default NavMenu;
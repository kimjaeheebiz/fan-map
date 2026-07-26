import type { IconifyIcon } from "@iconify/types";
import { iconToHTML, iconToSVG } from "@iconify/utils";
import ballBaseball from "@iconify-icons/tabler/ball-baseball";
import ballBasketball from "@iconify-icons/tabler/ball-basketball";
import ballFootball from "@iconify-icons/tabler/ball-football";
import type { SportId } from "@/features/catalog/types";

/** Lucide에 없는 종목만 Tabler(Iconify) — Lucide와 비슷한 stroke */
export const iconifyDataBySport = {
  baseball: ballBaseball,
  soccer: ballFootball,
  basketball: ballBasketball,
} as const satisfies Partial<Record<SportId, IconifyIcon>>;

export const iconifyNameBySport = {
  baseball: "tabler:ball-baseball",
  soccer: "tabler:ball-football",
  basketball: "tabler:ball-basketball",
} as const satisfies Partial<Record<SportId, string>>;

type SvgNode = [string, Record<string, string>];

/** Lucide에 있는 종목 — 마커 HTML용 path */
export const lucideSvgNodes: Partial<Record<SportId, SvgNode[]>> & {
  default: SvgNode[];
} = {
  volleyball: [
    ["path", { d: "M11 7a16 16 20 0 1 10.98 4.362" }],
    ["path", { d: "M12 12a13 13 0 0 1-8.66 5" }],
    ["path", { d: "M16.83 13.634a16 16 0 0 1-9.267 7.328" }],
    ["path", { d: "M20.66 17A13 13 0 0 0 12 12a13 13 0 0 1 0-10" }],
    ["path", { d: "M8.17 15.366a16 16 0 0 1-1.713-11.69" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
  ],
  esports: [
    ["line", { x1: "6", x2: "10", y1: "11", y2: "11" }],
    ["line", { x1: "8", x2: "8", y1: "9", y2: "13" }],
    ["line", { x1: "15", x2: "15.01", y1: "12", y2: "12" }],
    ["line", { x1: "18", x2: "18.01", y1: "10", y2: "10" }],
    [
      "path",
      {
        d: "M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z",
      },
    ],
  ],
  other: [
    ["path", { d: "m12 8 6-3-6-3v10" }],
    [
      "path",
      {
        d: "m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12",
      },
    ],
    ["path", { d: "m6.49 12.85 11.02 6.3" }],
    ["path", { d: "M17.51 12.85 6.5 19.15" }],
  ],
  default: [
    [
      "path",
      {
        d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      },
    ],
    ["circle", { cx: "12", cy: "10", r: "3" }],
  ],
};

function nodesToSvgInner(nodes: SvgNode[]) {
  return nodes
    .map(([tag, attrs]) => {
      const attr = Object.entries(attrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ");
      return `<${tag} ${attr}/>`;
    })
    .join("");
}

function lucideNodesToHtml(nodes: SvgNode[], className: string) {
  return `<svg class="${className}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${nodesToSvgInner(nodes)}</svg>`;
}

function iconifyDataToHtml(data: IconifyIcon, className: string) {
  const rendered = iconToSVG(data, { height: "16px" });
  return iconToHTML(rendered.body, {
    ...rendered.attributes,
    class: className,
    "aria-hidden": "true",
  });
}

/** 네이버 지도 마커 HTML용 인라인 SVG */
export function getSportIconSvgHtml(
  sportId: SportId | null | undefined,
  className = "fan-map-marker-icon",
) {
  if (sportId != null) {
    const iconifyData =
      iconifyDataBySport[sportId as keyof typeof iconifyDataBySport];
    if (iconifyData) return iconifyDataToHtml(iconifyData, className);

    const lucideNodes = lucideSvgNodes[sportId];
    if (lucideNodes) return lucideNodesToHtml(lucideNodes, className);
  }

  return lucideNodesToHtml(lucideSvgNodes.default, className);
}

export type CapabilityKind = "stream" | "control" | "access" | "media";

type CapabilityIconProps = {
  kind: CapabilityKind;
  className?: string;
};

export function CapabilityIcon({ kind, className }: CapabilityIconProps) {
  const common = {
    className,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "square" as const,
    strokeLinejoin: "miter" as const,
    "aria-hidden": true,
  };

  if (kind === "stream")
    return (
      <svg {...common}>
        <path d="M5 7h17v18H5z" />
        <path d="m13 12 6 4-6 4zM26 8c3 4 3 12 0 16M23 11c1.5 2.5 1.5 7.5 0 10" />
      </svg>
    );
  if (kind === "control")
    return (
      <svg {...common}>
        <path d="M16 4v24M4 16h24" />
        <path d="m16 4-3 3m3-3 3 3M16 28l-3-3m3 3 3-3M4 16l3-3m-3 3 3 3M28 16l-3-3m3 3-3 3" />
        <circle cx="16" cy="16" r="2.5" />
      </svg>
    );
  if (kind === "access")
    return (
      <svg {...common}>
        <rect x="6" y="14" width="20" height="13" />
        <path d="M10 14V9a6 6 0 0 1 12 0v5M16 19v4" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M4 9h9l3 3h12v14H4z" />
    </svg>
  );
}

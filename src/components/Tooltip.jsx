import { cloneElement, isValidElement, useId, useState } from "react";

const PLACEMENTS = {
  top: {
    panel: "bottom-full mb-3 translate-y-1",
    arrow: "-bottom-1.5 border-r border-b",
  },
  bottom: {
    panel: "top-full mt-3 -translate-y-1",
    arrow: "-top-1.5 border-l border-t",
  },
};

// Shown while the wrapper is hovered or contains keyboard focus.
const VISIBLE_CLASSES =
  "group-hover/tooltip:visible group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 " +
  "group-focus-within/tooltip:visible group-focus-within/tooltip:opacity-100 group-focus-within/tooltip:translate-y-0";

/**
 * Styled hover/focus tooltip matching the site's dark gradient look.
 * The child should be a focusable element; it receives `aria-describedby`.
 * Escape hides the tooltip until the pointer leaves or focus moves away.
 */
export const Tooltip = ({ content, children, placement = "top", className = "" }) => {
  const id = useId();
  const [dismissed, setDismissed] = useState(false);
  const styles = PLACEMENTS[placement] ?? PLACEMENTS.top;

  const trigger = isValidElement(children)
    ? cloneElement(children, { "aria-describedby": id })
    : children;

  return (
    <span
      className={`group/tooltip relative inline-flex ${className}`}
      onKeyDown={(e) => {
        if (e.key === "Escape") setDismissed(true);
      }}
      onMouseLeave={() => setDismissed(false)}
      onBlur={() => setDismissed(false)}
    >
      {trigger}
      <span
        id={id}
        role="tooltip"
        className={`pointer-events-none invisible absolute left-1/2 z-20 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl border border-gray-700/50 bg-gray-800/95 px-4 py-3 text-left text-xs leading-relaxed text-gray-300 opacity-0 shadow-2xl shadow-black/40 backdrop-blur-sm transition-all duration-300 ${styles.panel} ${dismissed ? "" : VISIBLE_CLASSES}`}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500"
        />
        {content}
        <span
          aria-hidden="true"
          className={`absolute left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-gray-700/50 bg-gray-800 ${styles.arrow}`}
        />
      </span>
    </span>
  );
};

export default Tooltip;

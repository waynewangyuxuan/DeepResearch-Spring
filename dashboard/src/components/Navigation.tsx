"use client";

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const NAV_ITEMS = [
  { id: "literature", label: "Literature", shortcut: "1" },
  { id: "ideas", label: "Ideas", shortcut: "2" },
  { id: "prototypes", label: "Prototypes", shortcut: "3" },
  { id: "progress", label: "Progress", shortcut: "4" },
  { id: "todo", label: "Todo", shortcut: "5" },
];

export default function Navigation({
  activeView,
  onViewChange,
}: NavigationProps) {
  return (
    <nav className="w-44 border-r border-border py-4 px-3 flex-shrink-0 bg-bg">
      <div className="space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                group w-full flex items-center justify-between
                px-3 py-1.5 rounded-md text-sm
                transition-all duration-150 ease-spring
                ${
                  isActive
                    ? "bg-fg text-fg-inverse font-medium"
                    : "text-fg-secondary hover:text-fg hover:bg-bg-subtle"
                }
              `}
            >
              <span className="tracking-tight">{item.label}</span>
              <span
                className={`
                  text-[10px] font-mono
                  ${isActive ? "text-fg-inverse/40" : "text-fg-tertiary opacity-0 group-hover:opacity-100"}
                  transition-opacity duration-150
                `}
              >
                {item.shortcut}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

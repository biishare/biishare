import { useEffect, useRef } from "react";
import { PlayCircle, FileText } from "lucide-react";

interface PlaylistItem {
  title: string;
  url: string;
}

interface ContentPlaylistProps {
  items: PlaylistItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  type: "video" | "document";
  maxHeight?: number;
}


export function ContentPlaylist({
  items,
  activeIndex,
  onSelect,
  type,
  maxHeight = 340,
}: ContentPlaylistProps) {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // 🔹 manter item ativo visível
  useEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeIndex]);

  return (
    <div
      className="border border-amber-300 rounded-xl overflow-y-auto"
      style={{ maxHeight }}
    >
      <ul className="divide-y divide-orange-200">
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <li
              key={index}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              onClick={() => onSelect(index)}
              className={`
                relative flex items-center gap-3 px-6 py-3 cursor-pointer
                transition-all duration-200 ease-in-out
                ${
                  isActive
                    ? "bg-amber-100"
                    : "hover:bg-amber-50"
                }
              `}
            >
              {/* 🔸 Barra lateral ativa */}
              <span
                className={`
                  absolute left-0 top-0 h-full w-1
                  transition-colors duration-200
                  ${
                    isActive
                      ? "bg-amber-500"
                      : "bg-transparent"
                  }
                `}
              />

              {/* Ícone */}
               {type === "video" ? (
                <PlayCircle className="text-amber-600 w-5 h-5 shrink-0" />
              ) : (
                <FileText className="text-amber-600 w-5 h-5 shrink-0" />
              )}

              <span
                title={item.title}
                className="text-orange-800 text-sm flex-1 truncate"
              >
                {item.title}
              </span>

              <span className="text-xs text-orange-600">
                {index + 1}/{items.length}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

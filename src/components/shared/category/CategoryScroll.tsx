import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { CategoryFilterCard } from "./CategoryFilterCard";

interface CategoryScrollProps {
  categories: Array<{
    id: string;
    name: string;
    _count: {
      products: number;
    };
  }> | undefined;
  selectedCategory: string;
  handleCategoryClick: (categoryId: string) => void;
  totalProduct?: number;
}

export function CategoryScroll({
  categories,
  selectedCategory,
  handleCategoryClick,
  totalProduct,
}: CategoryScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      {/* Fade effect kiri */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-background/40 to-transparent z-10"></div>

      {/* Fade effect kanan */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background/40 to-transparent z-10"></div>

      {/* Tombol scroll kiri */}
      <button
        onClick={scrollLeft}
        className="mx-2 hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-zinc-800 hover:bg-zinc-700 shadow rounded-full p-2"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scroll-smooth no-scrollbar"
      >
        <CategoryFilterCard
          key={"all"}
          name={"All"}
          isSelected={selectedCategory === "all"}
          onClick={() => handleCategoryClick("all")}
          productCount={totalProduct ?? 0}
        />

        {categories?.map((category) => (
          <CategoryFilterCard
            key={category.id}
            name={category.name}
            isSelected={category.id === selectedCategory}
            onClick={() => handleCategoryClick(category.id)}
            productCount={category._count.products}
          />
        ))}
      </div>

      {/* Tombol scroll kanan */}
      <button
        onClick={scrollRight}
        className="mx-2 hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-zinc-800 hover:bg-zinc-700 shadow rounded-full p-2"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
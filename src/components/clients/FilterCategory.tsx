import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface FilterCategoryProps {
  /**
   * Título da categoria de filtro
   */
  title: string;
  
  /**
   * Conteúdo da categoria (controles de filtro)
   */
  children: React.ReactNode;
  
  /**
   * Define se a categoria deve iniciar expandida ou colapsada
   * @default true
   */
  defaultExpanded?: boolean;
  
  /**
   * Classes CSS adicionais para o componente
   * @default ''
   */
  className?: string;
}

/**
 * Componente que representa uma categoria colapsável de filtros
 */
export const FilterCategory: React.FC<FilterCategoryProps> = ({
  title,
  children,
  defaultExpanded = true,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`filter-category border rounded-md overflow-hidden ${className}`}>
      <button
        type="button"
        className="w-full flex items-center justify-between p-3 bg-muted/50 hover:bg-muted transition-colors"
        onClick={toggleExpanded}
        aria-expanded={isExpanded}
      >
        <span className="font-medium">{title}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      {isExpanded && (
        <div className="p-3 border-t">
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterCategory;
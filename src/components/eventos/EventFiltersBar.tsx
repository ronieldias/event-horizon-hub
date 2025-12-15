import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EventFilters } from '@/types';
import { Search, Filter, X } from 'lucide-react';

interface EventFiltersBarProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
}

const categories = [
  'Todos',
  'Tecnologia',
  'Negócios',
  'Música',
  'Arte',
  'Esportes',
  'Educação',
  'Gastronomia',
  'Saúde',
  'Networking',
];

const states = [
  'Todos',
  'SP',
  'RJ',
  'MG',
  'RS',
  'PR',
  'BA',
  'SC',
  'GO',
  'PE',
  'CE',
];

export function EventFiltersBar({ filters, onFiltersChange }: EventFiltersBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchValue });
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      category: value === 'Todos' ? undefined : value 
    });
  };

  const handleStateChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      state: value === 'Todos' ? undefined : value 
    });
  };

  const handleClearFilters = () => {
    setSearchValue('');
    onFiltersChange({});
  };

  const hasActiveFilters = filters.search || filters.category || filters.state || filters.city || filters.isFree;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar eventos..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-12 bg-secondary/50"
          />
        </div>
        <Button type="submit" variant="default">
          Buscar
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleClearFilters}
            className="gap-2 text-muted-foreground"
          >
            <X className="h-4 w-4" />
            Limpar
          </Button>
        )}
      </form>

      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 rounded-lg bg-secondary/30 border border-border/50 animate-fade-in">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">Categoria</label>
            <Select
              value={filters.category || 'Todos'}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">Estado</label>
            <Select
              value={filters.state || 'Todos'}
              onValueChange={handleStateChange}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">Cidade</label>
            <Input
              placeholder="Digite a cidade"
              value={filters.city || ''}
              onChange={(e) => onFiltersChange({ ...filters, city: e.target.value || undefined })}
              className="w-[180px]"
            />
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              variant={filters.isFree ? 'default' : 'outline'}
              onClick={() => onFiltersChange({ ...filters, isFree: !filters.isFree ? true : undefined })}
              className="h-11"
            >
              Apenas Gratuitos
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

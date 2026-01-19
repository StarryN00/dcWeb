'use client';

import { Select } from '@/components/ui';

interface CaseFiltersProps {
  filters: {
    style: string;
    minArea: string;
    maxArea: string;
    minPrice: string;
    maxPrice: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
}

const styleOptions = [
  { value: '', label: '全部风格' },
  { value: 'modern', label: '现代' },
  { value: 'nordic', label: '北欧' },
  { value: 'industrial', label: '工业' },
  { value: 'wabi_sabi', label: '侘寂' },
  { value: 'luxury', label: '轻奢' },
  { value: 'minimalist', label: '极简' },
  { value: 'chinese', label: '中式' },
  { value: 'european', label: '欧式' },
];

const areaOptions = [
  { value: '', label: '不限' },
  { value: '0-80', label: '80㎡以下' },
  { value: '80-100', label: '80-100㎡' },
  { value: '100-120', label: '100-120㎡' },
  { value: '120-150', label: '120-150㎡' },
  { value: '150-200', label: '150-200㎡' },
  { value: '200', label: '200㎡以上' },
];

const priceOptions = [
  { value: '', label: '不限' },
  { value: '0-15', label: '15万以下' },
  { value: '15-25', label: '15-25万' },
  { value: '25-35', label: '25-35万' },
  { value: '35-50', label: '35-50万' },
  { value: '50', label: '50万以上' },
];

export function CaseFilters({ filters, onFilterChange, onReset }: CaseFiltersProps) {
  const handleAreaChange = (value: string) => {
    if (!value) {
      onFilterChange('minArea', '');
      onFilterChange('maxArea', '');
    } else if (value.includes('-')) {
      const [min, max] = value.split('-');
      onFilterChange('minArea', min);
      onFilterChange('maxArea', max);
    } else {
      onFilterChange('minArea', value);
      onFilterChange('maxArea', '');
    }
  };

  const handlePriceChange = (value: string) => {
    if (!value) {
      onFilterChange('minPrice', '');
      onFilterChange('maxPrice', '');
    } else if (value.includes('-')) {
      const [min, max] = value.split('-');
      onFilterChange('minPrice', min);
      onFilterChange('maxPrice', max);
    } else {
      onFilterChange('minPrice', value);
      onFilterChange('maxPrice', '');
    }
  };

  const getAreaValue = () => {
    if (!filters.minArea && !filters.maxArea) return '';
    if (filters.minArea && filters.maxArea) return `${filters.minArea}-${filters.maxArea}`;
    return filters.minArea;
  };

  const getPriceValue = () => {
    if (!filters.minPrice && !filters.maxPrice) return '';
    if (filters.minPrice && filters.maxPrice) return `${filters.minPrice}-${filters.maxPrice}`;
    return filters.minPrice;
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="glass-card-light radius-lg shadow-elevation-2 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-body-lg font-bold text-neutral-900">筛选条件</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            重置筛选
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* 风格筛选 */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            装修风格
          </label>
          <Select
            value={filters.style}
            onChange={(value) => onFilterChange('style', value)}
            options={styleOptions}
            placeholder="选择风格"
          />
        </div>

        {/* 面积筛选 */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            房屋面积
          </label>
          <Select
            value={getAreaValue()}
            onChange={handleAreaChange}
            options={areaOptions}
            placeholder="选择面积范围"
          />
        </div>

        {/* 价格筛选 */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            装修预算
          </label>
          <Select
            value={getPriceValue()}
            onChange={handlePriceChange}
            options={priceOptions}
            placeholder="选择预算范围"
          />
        </div>
      </div>

      {/* 活动筛选标签 */}
      {hasActiveFilters && (
        <div className="mt-6 pt-6 border-t border-neutral-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-neutral-600 font-medium">已选:</span>
            {filters.style && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {styleOptions.find((o) => o.value === filters.style)?.label}
                <button
                  onClick={() => onFilterChange('style', '')}
                  className="hover:text-primary-900 transition-colors"
                >
                  ×
                </button>
              </span>
            )}
            {(filters.minArea || filters.maxArea) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {getAreaValue() === filters.minArea
                  ? `${filters.minArea}㎡以上`
                  : `${filters.minArea}-${filters.maxArea}㎡`}
                <button
                  onClick={() => {
                    onFilterChange('minArea', '');
                    onFilterChange('maxArea', '');
                  }}
                  className="hover:text-primary-900 transition-colors"
                >
                  ×
                </button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {getPriceValue() === filters.minPrice
                  ? `${filters.minPrice}万以上`
                  : `${filters.minPrice}-${filters.maxPrice}万`}
                <button
                  onClick={() => {
                    onFilterChange('minPrice', '');
                    onFilterChange('maxPrice', '');
                  }}
                  className="hover:text-primary-900 transition-colors"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

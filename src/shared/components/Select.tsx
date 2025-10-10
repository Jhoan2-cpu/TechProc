import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: IconDefinition;
  className?: string;
  disabled?: boolean;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  icon,
  className = '',
  disabled = false,
  error,
}) => {
  return (
    <div className={`relative ${className}`}>
      {icon && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <FontAwesomeIcon icon={icon} className="text-primary-400" />
        </div>
      )}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full py-3 rounded-lg border text-white outline-none transition-all duration-300 cursor-pointer
          ${icon ? 'pl-12 pr-10' : 'pl-4 pr-10'}
          ${error
            ? 'border-danger/50 bg-danger/5 focus:border-danger focus:ring-2 focus:ring-danger/20'
            : 'border-gray-700/50 bg-secondary-700/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
          }
          ${disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:border-primary-500/50 hover:bg-secondary-600/50 hover:shadow-md'
          }
          focus:bg-secondary-700 focus:shadow-lg focus:shadow-primary-500/10
          appearance-none
        `}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className="bg-secondary-700 text-white py-2"
          >
            {option.label}
          </option>
        ))}
      </select>

      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-sm transition-colors duration-300 ${
            error ? 'text-danger' : 'text-primary-400'
          }`}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  );
};

export default Select;

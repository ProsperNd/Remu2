'use client';

import { useState, useEffect } from 'react';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

const countries: Country[] = [
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦' },
  // Add more countries as needed
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function PhoneInput({ value, onChange, className = '' }: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [nationalNumber, setNationalNumber] = useState('');

  useEffect(() => {
    // Update the full phone number when either country or number changes
    const fullNumber = `${selectedCountry.dialCode}${nationalNumber}`;
    onChange(fullNumber);
  }, [selectedCountry, nationalNumber, onChange]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setNationalNumber(input);
  };

  return (
    <div className="flex">
      <div className="relative w-32">
        <Listbox value={selectedCountry} onChange={setSelectedCountry}>
          <Listbox.Button className="relative w-full cursor-default rounded-l-md border border-r-0 border-gray-300 bg-white py-2 pl-3 pr-10 text-left focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
            <span className="flex items-center">
              <span className="mr-2">{selectedCountry.flag}</span>
              <span className="block truncate">{selectedCountry.dialCode}</span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {countries.map((country) => (
              <Listbox.Option
                key={country.code}
                value={country}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-3 pr-9 ${
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  }`
                }
              >
                {({ selected, active }) => (
                  <div className="flex items-center">
                    <span className="mr-2">{country.flag}</span>
                    <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                      {country.name} ({country.dialCode})
                    </span>
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>
      <input
        type="tel"
        value={nationalNumber}
        onChange={handleNumberChange}
        placeholder="Phone number"
        className={`flex-1 rounded-r-md ${className}`}
      />
    </div>
  );
} 
import { createContext, useContext, useMemo, useState } from 'react';
import { MONTHS, BUSINESS_UNITS, DEPARTMENTS, REPORTING_YEAR } from '../data/mockData';

const FilterContext = createContext(null);

const ALL = 'All';

export function FilterProvider({ children }) {
  const [year, setYear] = useState(String(REPORTING_YEAR));
  const [month, setMonth] = useState(ALL);
  const [businessUnit, setBusinessUnit] = useState(ALL);
  const [department, setDepartment] = useState(ALL);

  const value = useMemo(
    () => ({
      year,
      setYear,
      month,
      setMonth,
      businessUnit,
      setBusinessUnit,
      department,
      setDepartment,
      yearOptions: [String(REPORTING_YEAR)],
      monthOptions: [ALL, ...MONTHS],
      businessUnitOptions: [ALL, ...BUSINESS_UNITS],
      departmentOptions: [ALL, ...DEPARTMENTS],
      reset: () => {
        setMonth(ALL);
        setBusinessUnit(ALL);
        setDepartment(ALL);
      },
      ALL,
    }),
    [year, month, businessUnit, department],
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within a FilterProvider');
  return ctx;
}

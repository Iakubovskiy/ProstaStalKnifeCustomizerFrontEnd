import { useEffect, useState } from "react";
import Select from "react-select";
import {useTranslation} from "react-i18next";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectFilterProps {
  title: string;
  name: string;
  data: string[];
  onFilterChange: (name: string, values: string[]) => void;
  defaultValue?: string[];
}

const FilterSelect: React.FC<MultiSelectFilterProps> = ({
  title,
  name,
  data,
  onFilterChange,
  defaultValue,
}) => {
  const options: Option[] = data.map((item) => ({
    value: item,
    label: item,
  }));

  const { t } = useTranslation();
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  const handleChange = (selected: readonly Option[] | null) => {
    const selectedItems = selected ? [...selected] : [];
    setSelectedOptions(selectedItems);

    const selectedValues = selectedItems.map((item) => item.value);

    if (selectedValues.length === 0) {
      console.log(`Фільтр ${name} скинуто`);
    } else {
      console.log(`Фільтр ${name} встановлено:`, selectedValues);
    }

    onFilterChange(name, selectedValues);
  };
  useEffect(() => {
    if (defaultValue && defaultValue.length > 0) {
      const initial = defaultValue.map((item) => ({
        value: item,
        label: item,
      }));

      const areEqual =
        selectedOptions.length === initial.length &&
        selectedOptions.every((opt, idx) => opt.value === initial[idx].value);

      if (!areEqual) {
        setSelectedOptions(initial);
      }
    }
  }, [defaultValue]);

  return (
    <div className="flex flex-col mb-4">
      <label
        htmlFor={`filter-${name}`}
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        {title}
      </label>
      <Select
        id={`filter-${name}`}
        isMulti
        name={name}
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder={t("filterSelect.placeholder")}
        classNamePrefix="select"
        className="text-sm"
        noOptionsMessage={() =>  t("filterSelect.noOptionsMessage")}
        formatGroupLabel={() => t("filterSelect.formatGroupLabel")}
        isClearable={true}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        theme={(theme) => ({
          ...theme,
          borderRadius: 8,
          colors: {
            ...theme.colors,
            primary: "#d8a878",
            primary75: "#e8d9c5",
            primary50: "#f5ede2",
            primary25: "#faf6f1",
          },
        })}
        styles={{
          control: (base) => ({
            ...base,
            boxShadow: "none",
            borderColor: "#e5d8c5",
            "&:hover": {
              borderColor: "#d9c8b0",
            },
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: "#f5ede2",
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: "#000000",
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: "#c4ad8c",
            "&:hover": {
              backgroundColor: "#e8d9c5",
              color: "#816b4b",
            },
          }),
        }}
      />
    </div>
  );
};

export default FilterSelect;

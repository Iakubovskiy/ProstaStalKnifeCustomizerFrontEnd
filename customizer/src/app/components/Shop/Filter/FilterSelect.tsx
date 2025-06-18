import { useEffect, useState } from "react";
import Select from "react-select";

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
  // Convert string array to options format required by React Select
  const options: Option[] = data.map((item) => ({
    value: item,
    label: item,
  }));

  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  const handleChange = (selected: readonly Option[] | null) => {
    const selectedItems = selected ? [...selected] : [];
    setSelectedOptions(selectedItems);

    // Extract just the values to pass to the parent component
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
        placeholder="Виберіть..."
        classNamePrefix="select"
        className="text-sm"
        noOptionsMessage={() => "Немає варіантів"}
        formatGroupLabel={() => "Група"}
        isClearable={true}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        theme={(theme) => ({
          ...theme,
          borderRadius: 8,
          colors: {
            ...theme.colors,
            primary: "#d8a878", // основний колір
            primary75: "#e8d9c5", // трохи темніший відтінок
            primary50: "#f5ede2", // світліший відтінок
            primary25: "#faf6f1", // найсвітліший відтінок
          },
        })}
        styles={{
          control: (base) => ({
            ...base,
            boxShadow: "none",
            borderColor: "#e5d8c5", // темніший відтінок для рамки
            "&:hover": {
              borderColor: "#d9c8b0", // ще темніший відтінок при наведенні
            },
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: "#f5ede2", // світлий відтінок для тегів
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: "#000000", // коричневий для тексту тегів
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: "#c4ad8c", // середній коричневий для кнопки видалення
            "&:hover": {
              backgroundColor: "#e8d9c5", // світло-коричневий при наведенні
              color: "#816b4b", // темно-коричневий для тексту
            },
          }),
        }}
      />
    </div>
  );
};

export default FilterSelect;

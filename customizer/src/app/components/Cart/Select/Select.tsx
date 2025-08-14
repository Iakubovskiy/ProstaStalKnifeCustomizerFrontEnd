import './style.css';

interface inputProps {
    name: string;
    labelText: string;
    optionKeys: string[];
    options: string[];
    value: string;
    onChange: (value:string) => void;
}

const Select = ({name, labelText,optionKeys, options, value, onChange}: inputProps) => {
    return (
        <div className="flex flex-col mb-4">
            <label>
                { labelText }
            </label>
            <select
               id={name}
               name={name}
               value={value}
               onChange={(e) => onChange(e.target.value)}
            >
                {options.map((option, index) => {
                    return(
                        <option
                            key={optionKeys[index]}
                            value={optionKeys[index]}
                            className="text-black"
                        >
                            {option}
                        </option>
                    )
                })}
            </select>
        </div>
    );
}

export default Select;
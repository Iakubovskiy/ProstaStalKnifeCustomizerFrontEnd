import {HTMLInputTypeAttribute} from "react";
import './style.css';

interface inputProps {
    name: string;
    labelText: string;
    type: HTMLInputTypeAttribute;
    placeholder: string;
    value: string;
    onChange: (value:string) => void;
}

const input = ({name, labelText, type, placeholder, value, onChange}: inputProps) => {
    if(!type)
    {
        return (
          <div>
              Provide input type!
          </div>
        );
    }
    return (
        <div className="flex flex-col mb-4">
            <label>
                { labelText }
            </label>
            <input type={type}
                   id={name}
                   name={name}
                   placeholder={placeholder}
                   value={value}
                   onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

export default input;
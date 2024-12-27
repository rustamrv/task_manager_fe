import React, { FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

type Option = {
  label: string;
  value: string | number;
};

type Field = {
  name: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'object';
  placeholder?: string;
  value?: string | Date | Record<string, any>;
  options?: string[] | Option[];
  required?: boolean;
  subFields?: Array<Field>;
};

type DynamicFormProps = {
  fields: Array<Field>;
  onSubmit: (formData: Record<string, any>) => void;
  onCancel?: () => void;
  submitLabel?: string;
  error: any;
};

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  error,
}) => {
  const [formData, setFormData] = React.useState<Record<string, any>>(
    fields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value || '' }),
      {}
    )
  );

  const handleChange = (
    name: string,
    value: string | Date | Record<string, any>
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (
    parentName: string,
    name: string,
    value: string | Date
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parentName]: {
        ...prev[parentName],
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field: Field, parentName?: string) => {
    if (field.type === 'object' && field.subFields) {
      return (
        <div key={field.name} className="flex flex-col gap-2">
          <label className="text-sm font-medium">{field.label}</label>
          {field.subFields.map((subField) => renderField(subField, field.name))}
        </div>
      );
    }

    const fieldName = parentName ? `${parentName}.${field.name}` : field.name;

    return (
      <div key={field.name} className="flex flex-col gap-2">
        <label htmlFor={fieldName} className="text-sm font-medium">
          {field.label}
        </label>
        {field.type === 'text' ? (
          <Input
            id={fieldName}
            type="text"
            placeholder={field.placeholder}
            value={
              parentName
                ? formData[parentName]?.[field.name]
                : formData[field.name]
            }
            onChange={(e) =>
              parentName
                ? handleNestedChange(parentName, field.name, e.target.value)
                : handleChange(field.name, e.target.value)
            }
            required={field.required}
          />
        ) : field.type === 'select' ? (
          <Select
            value={
              parentName
                ? formData[parentName]?.[field.name]
                : formData[field.name]
            }
            onValueChange={(value) =>
              parentName
                ? handleNestedChange(parentName, field.name, value)
                : handleChange(field.name, value)
            }
            required={field.required}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={field.placeholder || 'Select an option'}
              />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(field.options) &&
                field.options.map((option) => {
                  if (typeof option === 'string') {
                    return (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    );
                  } else {
                    return (
                      <SelectItem
                        key={option.value}
                        value={String(option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    );
                  }
                })}
            </SelectContent>
          </Select>
        ) : field.type === 'date' ? (
          <Popover>
            <PopoverTrigger asChild>
              <Input
                id={fieldName}
                type="text"
                placeholder={field.placeholder || 'Select a date'}
                value={
                  parentName
                    ? new Date(
                        formData[parentName]?.[field.name]
                      ).toLocaleDateString()
                    : formData[field.name]
                      ? new Date(formData[field.name]).toLocaleDateString()
                      : ''
                }
                readOnly
                required={field.required}
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                selected={
                  parentName
                    ? formData[parentName]?.[field.name]
                    : formData[field.name]
                }
                onSelect={(date: any) =>
                  parentName
                    ? handleNestedChange(parentName, field.name, date)
                    : handleChange(field.name, date)
                }
                mode="single"
              />
            </PopoverContent>
          </Popover>
        ) : null}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="text-red-500">{error}</div>}
      {fields.map((field) => renderField(field))}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button variant="default" type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default DynamicForm;

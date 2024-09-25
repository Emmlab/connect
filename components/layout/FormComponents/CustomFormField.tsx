import React from "react";
import { Control, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CustomFormFieldProps = {
  name: string;
  control: unknown;
  inputType?: "textarea" | "text" | "password" | "email";
  placeholder?: string;
  label?: string;
  hideLabel?: boolean;
  className?: string;
  disabled?: boolean;
};
const CustomFormField = ({
  name,
  control,
  inputType,
  placeholder,
  label,
  hideLabel,
  className,
  disabled,
}: CustomFormFieldProps) => {
  return (
    <FormField
      control={control as Control<FieldValues>}
      name={name}
      render={({ field }) => (
        <FormItem>
          {!hideLabel ? (
            <FormLabel className="capitalize" htmlFor={name}>
              {label || name}
            </FormLabel>
          ) : null}
          <FormControl>
            {inputType === "textarea" ? (
              <Textarea
                placeholder={`${placeholder || ""}`}
                className={className || ""}
                disabled={disabled}
                autoComplete="on"
                id={name}
                {...field}
              />
            ) : (
              <Input
                type={`${inputType || "text"}`}
                placeholder={`${placeholder || ""}`}
                className={className || ""}
                disabled={disabled}
                autoComplete="on"
                id={name}
                {...field}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;

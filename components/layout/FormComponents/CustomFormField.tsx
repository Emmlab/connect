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
import { Eye, EyeOff } from "lucide-react";

type CustomFormFieldProps = {
  name: string;
  control: unknown;
  inputType?: "textarea" | "text" | "password" | "email";
  placeholder?: string;
  label?: string;
  description?: string;
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
  description,
  hideLabel,
  className,
  disabled,
}: CustomFormFieldProps) => {
  // handle view password
  const [showPassword, setShowPassword] = React.useState(false);
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
              <div
                className={`${inputType === "password" ? "flex items-center gap-1 h-10 w-full rounded-md border border-input bg-background py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" : ""}`}
              >
                <Input
                  type={`${inputType === "password" && showPassword ? "text" : inputType || "text"}`}
                  placeholder={`${placeholder || ""}`}
                  className={className || ""}
                  disabled={disabled}
                  autoComplete="on"
                  id={name}
                  {...field}
                />
                {/* allow user to see password */}
                {inputType === "password" ? (
                  <div
                    className="flex items-center px-2"
                    onMouseDown={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye /> : <EyeOff />}
                  </div>
                ) : null}
              </div>
            )}
          </FormControl>
          <FormMessage />
          {description ? (
            <div className="text-xs font-medium">{description}</div>
          ) : null}
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;

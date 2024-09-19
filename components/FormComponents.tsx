import { Control, FieldValues } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Button } from './ui/button';
import { Input } from './ui/input';


type CustomFormFieldProps = {
  name: string;
  control: unknown;
};
const CustomFormField = ({ name, control }: CustomFormFieldProps) => {
  return (
    <FormField
      control={control as Control<FieldValues>}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='capitalize'>{name}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type CustomFormSelectProps = {
  name: string;
  control: Control<FieldValues>;
  items: string[];
  labelText?: string;
};
const CustomFormSelect = ({
  name,
  control,
  items,
  labelText,
}: CustomFormSelectProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='capitalize'>{labelText || name}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => {
                return (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type CustomButtonProps = {
  icon?: React.ReactNode;
  text: string,
  handleClick?: () => void,
  isPending: boolean,
  className?: string,
  size?: "sm" | "lg" | "icon" | "default" | null | undefined,
  type?: 'button' | 'submit' | 'reset'
}
const CustomButton = ({ icon, text, handleClick, isPending, className, size, type }: CustomButtonProps) => {
  return (
    <Button
      size={size || 'sm'}
      type={type || 'button'}
      className={className || 'flex gap-x-2 items-center'}
      disabled={isPending}
      onClick={() => handleClick && handleClick()}
    >
      {icon}
      {isPending ? 'loading...' : text}
    </Button>
  );
}

export { CustomFormField, CustomFormSelect, CustomButton };

"use client";
import React from "react";
import { Plus } from "lucide-react";
import CustomButton from "@/components/layout/FormComponents/CustomButton";
import CustomFormField from "@/components/layout/FormComponents/CustomFormField";
import CustomDateRangePicker from "@/components/layout/FormComponents/CustomDateRangePicker";
import { Form } from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { educationFormSchema, EducationFormType } from "@/utils/types/";
import { createEducationAction } from "@/utils/actions/";
import { DateRange } from "react-day-picker";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { addDays } from "date-fns";

const CreateEducationForm = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  // set default input date range
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  // initialize form
  const form = useForm<EducationFormType>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      school: "",
      course: "",
    },
  });

  // handle create education
  const { mutate, isPending } = useMutation({
    mutationFn: (values: EducationFormType) =>
      createEducationAction(values, dateRange),
    onSuccess: (data) => {
      if (data?.error) {
        toast({
          description: data.error,
        });
        return;
      }
      toast({ description: "Education created successfully" });
      // update education data
      queryClient.invalidateQueries({ queryKey: ["education"] });
      // clear form
      form.reset();
      // redirect user to education list page
      router.push("/profile/education");
    },
  });

  // handle submit
  const onSubmit = (values: EducationFormType) => mutate(values);

  return (
    <Form {...form}>
      <form
        className="bg-muted pb-20 px-4 rounded-md"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center w-full">
            <h2 className="font-bold pt-4 pb-2">Add Education</h2>
          </div>
          <div className="">
            <CustomFormField
              placeholder="Havard University"
              name="school"
              control={form.control}
            />
            <CustomFormField
              placeholder="Bachelors of science in IT"
              name="course"
              control={form.control}
            />
            <CustomDateRangePicker
              label="Period"
              date={dateRange}
              setDate={
                setDateRange as React.Dispatch<
                  React.SetStateAction<DateRange | undefined>
                >
              }
            />
          </div>
          <div>
            <CustomButton
              type="submit"
              icon={<Plus />}
              className="mt-4 w-fit flex gap-x-2 items-center"
              isPending={isPending}
              text={"Submit"}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CreateEducationForm;

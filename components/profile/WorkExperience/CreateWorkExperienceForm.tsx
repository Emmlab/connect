"use client";
import React from "react";
import { Plus } from "lucide-react";
import CustomButton from "@/components/layout/FormComponents/CustomButton";
import CustomFormField from "@/components/layout/FormComponents/CustomFormField";
import CustomDateRangePicker from "@/components/layout/FormComponents/CustomDateRangePicker";
import { Form } from "@/components/ui/form";
import { addDays } from "date-fns";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  workExperienceFormSchema,
  WorkExperienceFormType,
} from "@/utils/types/workExperience";
import { createWorkExperienceAction } from "@/utils/actions/";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";

const CreateWorkExperienceForm = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  // set default form input date range
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  // initialize form
  const form = useForm<WorkExperienceFormType>({
    resolver: zodResolver(workExperienceFormSchema),
    defaultValues: {
      company: "",
      role: "",
      description: "",
    },
  });

  // handle create developer work experience
  const { mutate, isPending } = useMutation({
    mutationFn: (values: WorkExperienceFormType) =>
      createWorkExperienceAction(values, dateRange),
    onSuccess: (data) => {
      if (!data) {
        toast({
          description: "Something went wrong",
        });
        return;
      }
      toast({ description: "Work Experience created successfully" });
      // update work experience data
      queryClient.invalidateQueries({ queryKey: ["workExperience"] });
      // redirect to work experience list page
      router.push("/profile/work-experience");
    },
  });

  // handle form submit
  const onSubmit = (values: WorkExperienceFormType) => mutate(values);

  return (
    <Form {...form}>
      <form
        className="bg-muted pb-20 px-4 rounded-md"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center w-full">
            <h2 className="font-bold pt-4 pb-2">Add Work Experience</h2>
          </div>
          <div className="">
            <CustomFormField
              placeholder="Your Company Name"
              name="company"
              control={form.control}
            />
            <CustomFormField
              placeholder="eg. Software Engineer"
              name="role"
              control={form.control}
            />
            <CustomFormField
              inputType="textarea"
              placeholder="Describe your role in the company"
              name="description"
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

export default CreateWorkExperienceForm;

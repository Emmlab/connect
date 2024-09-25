'use client';
import React, { useEffect, useState } from "react";
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Form } from '@/components/ui/form';
import CustomButton from '@/components/layout/FormComponents/CustomButton';
import CustomFormField from '@/components/layout/FormComponents/CustomFormField';
import CustomDateRangePicker from '@/components/layout/FormComponents/CustomDateRangePicker';

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { addDays } from "date-fns"
import { workExperienceFormSchema, WorkExperienceFormType } from '@/utils/types/workExperience';
import { getWorkExperienceItemAction, updateWorkExperienceItemAction } from '@/utils/actions/';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from "react-day-picker"


const EditWorkExperienceForm = ({ workExperienceId }: { workExperienceId: string }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  // set default input date range
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  })

  // handle get single work experience item
  const { data } = useQuery({
    queryKey: ['workExperience', workExperienceId],
    queryFn: () => getWorkExperienceItemAction(workExperienceId),
  });

  // update default date range
  useEffect(() => {
    if (data?.startDate && data?.endDate) {
      setDateRange({
        from:  new Date(data.startDate),
        to:  new Date(data.endDate)
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.startDate, data?.endDate])

  // handle update work experience
  const { mutate, isPending } = useMutation({
    mutationFn: (values: WorkExperienceFormType) =>
      updateWorkExperienceItemAction(workExperienceId, values, dateRange),
    onSuccess: (data) => {
      if (!data) {
        toast({
          description: 'Something went wrong',
        });
        return;
      }
      toast({ description: 'Work Experience updated' });
      // update work experience data
      queryClient.invalidateQueries({ queryKey: ['workExperience'] });
      router.push('/profile/work-experience');
    },
  });

  // initialize form
  const form = useForm<WorkExperienceFormType>({
    resolver: zodResolver(workExperienceFormSchema),
    defaultValues: {
      company: data?.company || '',
      role: data?.role || '',
      description: data?.description || ''
    },
  });

  // handle submit
  const onSubmit = (values: WorkExperienceFormType) => mutate(values);

  return (
    <Form {...form}>
      <form
        className='bg-muted pb-20 px-4 rounded-md'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='flex flex-col gap-2'>
          <div className="flex items-center w-full">
            <h2 className="font-bold pt-4 pb-2">Edit Work Experience</h2>
          </div>
          <div className="">
            <CustomFormField
              placeholder="Your Company Name"
              name="company"
              control={form.control} />
            <CustomFormField
              placeholder="eg. Software Engineer"
              name="role"
              control={form.control} />
            <CustomFormField
              inputType="textarea"
              placeholder="Describe your role in the company"
              name="description"
              control={form.control} />
            <CustomDateRangePicker
              label="Period"
              date={dateRange}
              setDate={setDateRange as React.Dispatch<React.SetStateAction<DateRange | undefined>>} />
          </div>
          <div>
            <CustomButton
              type='submit'
              icon={<Pencil />}
              className="mt-4 w-fit flex gap-x-2 items-center"
              isPending={isPending}
              text={'Submit'}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
export default EditWorkExperienceForm;

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
import { educationFormSchema, EducationFormType } from '@/utils/types/education';
import { getEducationItemAction, updateEducationItemAction } from '@/utils/actions/';
import { useToast } from '../../../hooks/use-toast';
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";


const EditEducationForm = ({ educationId }: { educationId: string }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  // set default date range
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  })

  // get single education item using id
  const { data } = useQuery({
    queryKey: ['education', educationId],
    queryFn: () => getEducationItemAction(educationId),
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

  // handle update education item
  const { mutate, isPending } = useMutation({
    mutationFn: (values: EducationFormType) =>
      updateEducationItemAction(educationId, values, dateRange),
    onSuccess: (data) => {
      if (!data) {
        toast({
          description: 'Something went wrong',
        });
        return;
      }
      toast({ description: 'Education updated' });
      // update education data
      queryClient.invalidateQueries({ queryKey: ['education'] });
      // redirect to education list page
      router.push('/profile/education');
    },
  });

  // initialize form
  const form = useForm<EducationFormType>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      school: data?.school || '',
      course: data?.course || '',
    },
  });

  // handle form submit
  const onSubmit = (values: EducationFormType) => mutate(values);

  return (
    <Form {...form}>
      <form
        className='bg-muted pb-20 px-4 rounded-md'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='flex flex-col gap-2'>
          <div className="flex items-center w-full">
            <h2 className="font-bold pt-4 pb-2">Edit Education</h2>
          </div>
          <div className="">
            <CustomFormField placeholder="Havard University" name="school" control={form.control} />
            <CustomFormField placeholder="Bachelors of science in IT" name="course" control={form.control} />
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

export default EditEducationForm;

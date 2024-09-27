"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormLabel } from "@/components/ui/form";
import ProfileNavigation from "../ProfileNavigation";
import CustomButton from "@/components/layout/FormComponents/CustomButton";
import CustomFormField from "@/components/layout/FormComponents/CustomFormField";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { developerFormSchema, DeveloperFormType } from "@/utils/types/";
import { updateDeveloper, getAuthenticatedDeveloper } from "@/utils/actions/";

const PersonalDetails = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  // get developer
  const { data: developerData } = useQuery({
    queryKey: ["developer", 1],
    queryFn: () => getAuthenticatedDeveloper(),
  });

  // handle update developer name
  const { mutate, isPending } = useMutation({
    mutationFn: (values: DeveloperFormType) => updateDeveloper(values),
    onSuccess: (data) => {
      if (data?.error) {
        toast({
          description: data.error,
        });
        return;
      }
      toast({ description: "Account updated" });
      // update developer/developers data
      queryClient.invalidateQueries({ queryKey: ["developer"] });
      queryClient.invalidateQueries({ queryKey: ["developers"] });
    },
  });

  // get developerId, name, email from page url
  // details on params allows public access
  const developerId = searchParams.get("developerId") || null;
  const developer = developerId
    ? {
        name: searchParams.get("name") || "",
        email: searchParams.get("email") || "",
      }
    : developerData;

  // initialize form
  const form = useForm<DeveloperFormType>({
    resolver: zodResolver(developerFormSchema),
    defaultValues: {
      name: developer?.name || searchParams.get("name") || "",
    },
  });

  // handle submit
  const onSubmit = (values: DeveloperFormType) => mutate(values);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row gap-2">
          <ProfileNavigation />
          <Card className="bg-muted w-full min-h-[70vh]">
            <CardHeader className="flex mt-2">
              <CardTitle className="">Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="">
              <CustomFormField
                placeholder={developer?.name || "John Doe"}
                name="name"
                control={form.control}
                disabled={developerId ? true : false}
              />
              <FormLabel className="capitalize">Email</FormLabel>
              <Input
                type="email"
                placeholder="john.doe@gmail.com"
                name="email"
                disabled
                className="py-2"
                value={developer ? developer?.email : "john.doe@gmail.com"}
              />
              {/* component accessed in unprotected routes
                hide button if user has no access */}
              {!developerId ? (
                <>
                  {/* optional */}
                  <CustomFormField
                    inputType="password"
                    name="password"
                    control={form.control}
                  />
                  <CustomFormField
                    inputType="password"
                    name="confirmPassword"
                    control={form.control}
                  />
                  <div className="mt-4">
                    <CustomButton
                      type="submit"
                      className="mt-4 w-fit flex gap-x-2 items-center"
                      isPending={isPending}
                      text={"Submit"}
                    />
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
};

export default PersonalDetails;

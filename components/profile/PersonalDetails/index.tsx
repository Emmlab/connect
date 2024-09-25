"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ProfileNavigation from "../ProfileNavigation";
import { Form, FormLabel } from "@/components/ui/form";
import CustomButton from "@/components/layout/FormComponents/CustomButton";
import CustomFormField from "@/components/layout/FormComponents/CustomFormField";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { developerNameFormSchema } from "@/utils/types/developer";
import { updateDeveloperName, getDeveloper } from "@/utils/actions/";

const PersonalDetails = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  // get developer
  const { data: developerData } = useQuery({
    queryKey: ["developer", 1],
    queryFn: () => getDeveloper(),
  });

  // handle update developer name
  const { mutate, isPending } = useMutation({
    mutationFn: (values: { name: string }) => updateDeveloperName(values),
    onSuccess: (data) => {
      if (!data) {
        toast({
          description: "Something went wrong",
        });
        return;
      }
      toast({ description: "User name updated" });
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
  const form = useForm<{ name: string }>({
    resolver: zodResolver(developerNameFormSchema),
    defaultValues: {
      name: developer?.name || "",
    },
  });

  // handle submit
  const onSubmit = (values: { name: string }) => mutate(values);

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
                <div className="mt-4">
                  <CustomButton
                    type="submit"
                    className="mt-4 w-fit flex gap-x-2 items-center"
                    isPending={isPending}
                    text={"Submit"}
                  />
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
};

export default PersonalDetails;

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomButton from "@/components/layout/FormComponents/CustomButton";
import { GraduationCap, Pencil, Trash2 } from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEducationItemAction } from "@/utils/actions/";
import { useToast } from "@/hooks/use-toast";
import { EducationType } from "@/utils/types/education";
import { format } from "date-fns";

const EducationCard = ({ educationItem }: { educationItem: EducationType }) => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  // get developerId from url
  const developerId = searchParams.get("developerId") || undefined;

  // handle delete education item
  const { mutate: mutateDeleteEducation, isPending: isPendingDeleteEducation } =
    useMutation({
      mutationFn: (id: string) => deleteEducationItemAction(id),
      onSuccess: (data) => {
        if (data?.error) {
          toast({
            description: data?.error,
          });
          return;
        }
        // update education data
        queryClient.invalidateQueries({ queryKey: ["education"] });
        toast({ description: "Education removed" });
      },
    });

  return (
    <Card className="bg-muted border border-slate-500 rounded-md shadow-md">
      <CardHeader className="flex gap-2 p-2 md:px-5">
        <CardTitle className="flex items-center gap-2">
          <div className="rounded-full border-2 border-slate-400 bg-slate-400 text-white w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex items-center justify-center">
            <GraduationCap />
          </div>
          <div className="flex flex-col">
            <div className="line-clamp-1 text-base">
              {educationItem.school || "Unknown"}
            </div>
            <div className="text-xs font-normal italic">
              {format(educationItem.startDate, "LLL dd, y")} -{" "}
              {format(educationItem.endDate, "LLL dd, y")}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 md:px-5 md:pt-0 md:pb-4">
        <div className="md:pl-[48px]">{educationItem.course}</div>
        {/* component accessed in unprotected routes
            hide add education button if user has no access */}
        {!developerId ? (
          <div className="flex items-center gap-2 my-2 md:pl-[48px]">
            {!isPendingDeleteEducation ? (
              <CustomButton
                icon={<Pencil className="h-[18px]" />}
                text=""
                handleClick={() =>
                  router.push(`/profile/education/${educationItem.$id}`)
                }
                isPending={false}
                className="h-fit w-fit px-2 py-1"
              />
            ) : null}
            <CustomButton
              icon={<Trash2 className="h-[18px]" />}
              text=""
              handleClick={() =>
                educationItem && mutateDeleteEducation(educationItem.$id)
              }
              isPending={isPendingDeleteEducation}
              isDelete
              className="h-fit w-fit px-2 py-1"
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default EducationCard;

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import CustomButton from "@/components/layout/FormComponents/CustomButton";
import { BriefcaseBusiness, Pencil, Trash2 } from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWorkExperienceItemAction } from "@/utils/actions/";
import { WorkExperienceType } from "@/utils/types/workExperience";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const WorkExperienceCard = ({
  workExperienceItem,
}: {
  workExperienceItem: WorkExperienceType;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  // get developerId from url
  const developerId = searchParams.get("developerId") || undefined;

  // handle delete work experience item
  const {
    mutate: mutateDeleteWorkExperience,
    isPending: isPendingDeleteWorkExperience,
  } = useMutation({
    mutationFn: (id: string) => deleteWorkExperienceItemAction(id),
    onSuccess: (data) => {
      if (!data) {
        toast({
          description: "Something went wrong",
        });
        return;
      }
      // update work experience data
      queryClient.invalidateQueries({ queryKey: ["workExperience"] });
      toast({ description: "Work Experience removed" });
    },
  });

  return (
    <Card className="bg-muted border border-slate-500 rounded-md shadow-md">
      <CardHeader className="flex gap-2 p-2 md:px-5">
        <CardTitle className="flex items-center gap-2">
          <div className="rounded-full border-2 border-slate-400 bg-slate-400 text-white w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex items-center justify-center">
            <BriefcaseBusiness />
          </div>
          <div className="flex flex-col">
            <div className="line-clamp-1 text-base">
              {workExperienceItem.company || "Unknown"}
            </div>
            <div className="text-sm font-normal">
              {workExperienceItem.role} -{" "}
              <i className="text-xs">
                {format(workExperienceItem.startDate, "LLL dd, y")} -{" "}
                {format(workExperienceItem.endDate, "LLL dd, y")}
              </i>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 md:px-5 md:pt-0 md:pb-4">
        <p className="md:pl-[48px]">{workExperienceItem.description}</p>
        {/* component accessed in unprotected routes
            hide buttons if user has no access */}
        {!developerId ? (
          <div className="flex items-center gap-2 my-2 md:pl-[48px]">
            {/* edit button */}
            {!isPendingDeleteWorkExperience ? (
              <CustomButton
                icon={<Pencil className="h-[18px]" />}
                text=""
                handleClick={() =>
                  router.push(
                    `/profile/work-experience/${workExperienceItem.$id}`,
                  )
                }
                isPending={false}
                className="h-fit w-fit px-2 py-1"
              />
            ) : null}
            {/* delete button */}
            <CustomButton
              icon={<Trash2 className="h-[18px]" />}
              text=""
              handleClick={() =>
                mutateDeleteWorkExperience(workExperienceItem.$id)
              }
              isPending={isPendingDeleteWorkExperience}
              isDelete
              className="h-fit w-fit px-2 py-1"
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
export default WorkExperienceCard;

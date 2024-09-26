"use server";
import { redirect } from "next/navigation";
import {
  WorkExperienceType,
  WorkExperienceFormType,
  workExperienceFormSchema,
} from "../types/workExperience";
import { DateRange } from "react-day-picker";
import { Query, ID } from "node-appwrite";
import { createSessionClient, createAdminClient } from "../appwrite";
import auth from "../auth";
import { authenticateAndRedirect } from "./developer";
import { DEFAULT_PAGE_LIMIT } from "../magicValues";

// WORK EXPERIENCE
// get work experience
const getWorkExperienceAction = async ({
  page = 1,
  developerId,
}: {
  page?: number;
  developerId?: string;
}): Promise<{
  data?: {
    workExperience: WorkExperienceType[];
    count: number;
    page: number;
    totalPages: number;
  };
  error?: string;
}> => {
  const developer = developerId
    ? { $id: developerId }
    : await authenticateAndRedirect();
  try {
    const queries = [
      Query.orderDesc("$createdAt"),
      Query.limit(DEFAULT_PAGE_LIMIT),
      Query.offset((page - 1) * DEFAULT_PAGE_LIMIT),
      Query.equal("developerId", [developer.$id as string]),
    ];

    const { databases } = await createAdminClient();
    // get work experiences based on queries
    const { documents, total } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "WorkExperience",
      queries,
    );
    const workExperience: WorkExperienceType[] = documents.map(
      (workExperienceItem) => ({
        $id: workExperienceItem.$id,
        $createdAt: workExperienceItem.$createdAt,
        $updatedAt: workExperienceItem.$updatedAt,
        company: workExperienceItem.company,
        role: workExperienceItem.role,
        description: workExperienceItem.description,
        startDate: workExperienceItem.startDate,
        endDate: workExperienceItem.endDate,
        developerId: workExperienceItem.developerId,
      }),
    );
    // calculate total page count
    const totalPages = Math.ceil(total / DEFAULT_PAGE_LIMIT);
    return { data: { workExperience, count: total, page, totalPages } };
  } catch (error) {
    console.error(error);
    return {
      data: { workExperience: [], count: 0, page: page, totalPages: 0 },
      error: "Something went wrong",
    };
  }
};

// get work experience Item
const getWorkExperienceItemAction = async (
  id: string,
): Promise<{
  data?: WorkExperienceType;
  error?: string;
}> => {
  await authenticateAndRedirect();
  const sessionCookie = auth.getSession();
  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    // get work experience
    const document = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "WorkExperience",
      id,
    );
    const workExperienceItem: WorkExperienceType = {
      $id: document.id,
      $createdAt: document.createdAt,
      $updatedAt: document.updatedAt,
      company: document.company,
      role: document.role,
      description: document.description,
      startDate: document.startDate,
      endDate: document.endDate,
      developerId: document.developerId,
    };
    // API is called on workexperience edit page
    // redirect back to workexperience list if no item found
    if (!workExperienceItem) {
      redirect("/profile/work-experience");
    }
    return { data: workExperienceItem };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

// create work experience
const createWorkExperienceAction = async (
  values: WorkExperienceFormType,
  dateRange: DateRange,
): Promise<{
  data?: WorkExperienceType;
  error?: string;
}> => {
  const sessionCookie = auth.getSession();
  const developer = await authenticateAndRedirect();
  try {
    workExperienceFormSchema.parse(values);
    const { databases } = await createSessionClient(sessionCookie.value);
    // add date range and developerId to payload
    const data = {
      ...values,
      startDate: dateRange.from,
      endDate: dateRange.to,
      developerId: developer.$id,
    };
    // create work experience
    const document = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "WorkExperience",
      ID.unique(),
      data,
    );
    const workExperienceItem: WorkExperienceType = {
      $id: document.id,
      $createdAt: document.createdAt,
      $updatedAt: document.updatedAt,
      company: document.company,
      role: document.role,
      description: document.description,
      startDate: document.startDate,
      endDate: document.endDate,
      developerId: document.developerId,
    };

    return { data: workExperienceItem };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

// edit work experience
const updateWorkExperienceItemAction = async (
  id: string,
  values: WorkExperienceFormType,
  dateRange: DateRange,
): Promise<{
  data?: WorkExperienceType;
  error?: string;
}> => {
  const sessionCookie = auth.getSession();
  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    // update work experience
    const document = await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "WorkExperience",
      id,
      { ...values, startDate: dateRange.from, endDate: dateRange.to },
    );
    const workExperienceItem: WorkExperienceType = {
      $id: document.id,
      $createdAt: document.createdAt,
      $updatedAt: document.updatedAt,
      company: document.company,
      role: document.role,
      description: document.description,
      startDate: document.startDate,
      endDate: document.endDate,
      developerId: document.developerId,
    };

    return { data: workExperienceItem };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

// delete work experience
const deleteWorkExperienceItemAction = async (
  id: string,
): Promise<{
  data?: string;
  error?: string;
}> => {
  await authenticateAndRedirect();
  const sessionCookie = auth.getSession();
  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "WorkExperience",
      id,
    );
    return { data: id };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export {
  //WORK EXPERIENCE
  getWorkExperienceAction,
  getWorkExperienceItemAction,
  createWorkExperienceAction,
  updateWorkExperienceItemAction,
  deleteWorkExperienceItemAction,
};

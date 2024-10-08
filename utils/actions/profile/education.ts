"use server";
import { redirect } from "next/navigation";
import {
  EducationType,
  EducationFormType,
  educationFormSchema,
} from "../../types/";
import { DateRange } from "react-day-picker";
import { Query, ID } from "node-appwrite";
import { createSessionClient, createAdminClient } from "../../appwrite";
import auth from "../../appwrite/auth";
import { authenticateAndRedirect } from "../auth";
import { DEFAULT_PAGE_LIMIT } from "../../magicValues";

// EDUCATION
// get education
const getEducationAction = async ({
  page = 1,
  developerId,
}: {
  page?: number;
  developerId?: string;
}): Promise<{
  data?: {
    education: EducationType[];
    count: number;
    page: number;
    totalPages: number;
  };
  error?: string;
} | null> => {
  const developer = developerId
    ? { $id: developerId }
    : await authenticateAndRedirect();
  try {
    // define database queries
    const queries = [
      Query.orderDesc("$createdAt"),
      Query.limit(DEFAULT_PAGE_LIMIT),
      Query.offset((page - 1) * DEFAULT_PAGE_LIMIT),
      Query.equal("developerId", [developer.$id as string]),
    ];

    const { databases } = await createAdminClient();
    // get education list based on queries
    const { documents, total } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Education",
      queries,
    );
    const education: EducationType[] = documents.map((educationItem) => ({
      $id: educationItem.$id,
      $createdAt: educationItem.$createdAt,
      $updatedAt: educationItem.$updatedAt,
      school: educationItem.school,
      course: educationItem.course,
      startDate: educationItem.startDate,
      endDate: educationItem.endDate,
      developerId: educationItem.developerId,
    }));

    // calculate total page count
    const totalPages = Math.ceil(total / DEFAULT_PAGE_LIMIT);
    return { data: { education, count: total, page, totalPages } };
  } catch (error) {
    console.error(error);
    return {
      data: { education: [], count: 0, page: page, totalPages: 0 },
      error: "Something went wrong",
    };
  }
};

// get education
const getEducationItemAction = async (
  id: string,
): Promise<{ data?: EducationType; error?: string }> => {
  await authenticateAndRedirect();
  const sessionCookie = auth.getSession();
  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    // get education item based on id
    const document = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Education",
      id,
    );
    const educationItem: EducationType = {
      $id: document.id,
      $createdAt: document.createdAt,
      $updatedAt: document.updatedAt,
      school: document.school,
      course: document.course,
      startDate: document.startDate,
      endDate: document.endDate,
      developerId: document.developerId,
    };
    // API is called on education edit page
    // redirect back to education list if no item found
    if (!educationItem) {
      redirect("/profile/education");
    }
    return { data: educationItem };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

// create education
const createEducationAction = async (
  values: EducationFormType,
  dateRange: DateRange,
): Promise<{
  data?: EducationType;
  error?: string;
}> => {
  const sessionCookie = auth.getSession();
  const developer = await authenticateAndRedirect();
  try {
    educationFormSchema.parse(values);
    const { databases } = await createSessionClient(sessionCookie.value);
    // add date range and developerId to payload
    const data = {
      ...values,
      startDate: dateRange.from,
      endDate: dateRange.to,
      developerId: developer.$id,
    };
    // create education ite,
    const document = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Education",
      ID.unique(),
      data,
    );
    const educationItem: EducationType = {
      $id: document.id,
      $createdAt: document.createdAt,
      $updatedAt: document.updatedAt,
      school: document.school,
      course: document.course,
      startDate: document.startDate,
      endDate: document.endDate,
      developerId: document.developerId,
    };
    return { data: educationItem };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

// edit education
const updateEducationItemAction = async (
  id: string,
  values: EducationFormType,
  dateRange: DateRange,
): Promise<{
  data?: EducationType;
  error?: string;
}> => {
  const sessionCookie = auth.getSession();
  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    // update education item
    const document = await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Education",
      id,
      { ...values, startDate: dateRange.from, endDate: dateRange.to },
    );
    const educationItem: EducationType = {
      $id: document.id,
      $createdAt: document.createdAt,
      $updatedAt: document.updatedAt,
      school: document.school,
      course: document.course,
      startDate: document.startDate,
      endDate: document.endDate,
      developerId: document.developerId,
    };
    return { data: educationItem };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

// delete education
const deleteEducationItemAction = async (
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
      "Education",
      id,
    );
    return { data: id };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export {
  //EDUCATION
  getEducationAction,
  getEducationItemAction,
  createEducationAction,
  updateEducationItemAction,
  deleteEducationItemAction,
};

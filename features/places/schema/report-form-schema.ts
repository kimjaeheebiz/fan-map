import { z } from "zod";
import { MAX_REPORT_IMAGES } from "@/features/places/lib/image-utils";

const sportIdEnum = [
  "baseball",
  "soccer",
  "basketball",
  "volleyball",
  "esports",
  "other",
] as const;

export const sportTeamSetSchema = z.object({
  sportId: z.enum(sportIdEnum, { message: "종목을 선택해 주세요." }),
  teamIds: z.array(z.string()).optional(),
});

export const reportFormSchema = z.object({
  sportTeams: z
    .array(sportTeamSetSchema)
    .min(1, "종목을 하나 이상 추가해 주세요."),
  watchedAt: z.string().min(1, "방문일을 선택해 주세요."),
  review: z
    .string()
    .trim()
    .min(10, "후기를 10자 이상 입력해 주세요.")
    .max(1000, "후기는 1000자 이내로 입력해 주세요."),
  tagIds: z.array(z.string()).optional(),
  images: z
    .array(z.string())
    .max(MAX_REPORT_IMAGES, `사진은 최대 ${MAX_REPORT_IMAGES}장까지 가능합니다.`),
});

export type ReportFormValues = z.infer<typeof reportFormSchema>;

export function getDefaultReportFormValues(): ReportFormValues {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  return {
    sportTeams: [{ sportId: "baseball", teamIds: [] }],
    watchedAt: `${yyyy}-${mm}-${dd}`,
    review: "",
    tagIds: [],
    images: [],
  };
}

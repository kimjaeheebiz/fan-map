import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().min(2, "이름은 2자 이상이어야 합니다."),
  email: z.email("유효한 이메일을 입력해 주세요."),
  role: z.enum(["admin", "editor", "viewer"]),
  status: z.enum(["active", "inactive"]),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

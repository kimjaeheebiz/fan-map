"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/common/form-field";
import {
  userFormSchema,
  type UserFormValues,
} from "@/features/users/schema";
import {
  userRoleItems,
  userStatusItems,
} from "@/features/users/labels";

type UserFormProps = {
  defaultValues?: Partial<UserFormValues>;
  submitLabel?: string;
  onSubmit: (values: UserFormValues) => Promise<void> | void;
  onCancel?: () => void;
};

export function UserForm({
  defaultValues,
  submitLabel = "저장",
  onSubmit,
  onCancel,
}: UserFormProps) {
  const { control, handleSubmit, formState } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "viewer",
      status: "active",
      ...defaultValues,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
      className="flex flex-col gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField control={control} name="name" label="이름" required>
          {(field) => <Input {...field} id="name" placeholder="홍길동" />}
        </FormField>

        <FormField control={control} name="email" label="이메일" required>
          {(field) => (
            <Input
              {...field}
              id="email"
              type="email"
              placeholder="name@example.com"
            />
          )}
        </FormField>

        <FormField
          control={control}
          name="role"
          label="역할"
          required
          tooltip="관리자는 전체 권한, 편집자는 수정, 뷰어는 조회만 가능합니다."
        >
          {(field) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              items={[...userRoleItems]}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="역할 선택" />
              </SelectTrigger>
              <SelectContent>
                {userRoleItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>

        <FormField control={control} name="status" label="상태" required>
          {(field) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              items={[...userStatusItems]}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                {userStatusItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={formState.isSubmitting}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
        )}
      </div>
    </form>
  );
}

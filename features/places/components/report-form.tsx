"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { FormField } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ImagePicker } from "@/features/places/components/image-picker";
import {
  sports,
  teams,
  venueTagCategoryLabels,
  venueTagCategoryOrder,
  venueTags,
} from "@/features/catalog/constants";
import {
  getDefaultReportFormValues,
  reportFormSchema,
  type ReportFormValues,
} from "@/features/places/schema/report-form-schema";
import type { PlaceDraft } from "@/features/places/data/place-storage";
import type { SportId } from "@/features/catalog/types";
import { cn } from "@/lib/utils";

const tagsByCategory = venueTagCategoryOrder
  .map((category) => ({
    category,
    label: venueTagCategoryLabels[category],
    tags: venueTags.filter((tag) => tag.category === category),
  }))
  .filter((group) => group.tags.length > 0);

type ReportFormProps = {
  placeDraft: PlaceDraft;
  defaultValues?: Partial<ReportFormValues>;
  submitLabel?: string;
  submitting?: boolean;
  onSubmit: (values: ReportFormValues) => Promise<void> | void;
  onBack?: () => void;
  className?: string;
};

export function ReportForm({
  placeDraft,
  defaultValues,
  submitLabel = "남기기",
  submitting = false,
  onSubmit,
  onBack,
  className,
}: ReportFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      ...getDefaultReportFormValues(),
      ...defaultValues,
    },
  });

  const sportTeams = watch("sportTeams") ?? [];
  const tagIds = watch("tagIds") ?? [];
  const images = watch("images") ?? [];

  const usedSportIds = new Set(sportTeams.map((set) => set.sportId));

  function updateSet(
    index: number,
    patch: Partial<{ sportId: SportId; teamIds: string[] }>,
  ) {
    const next = sportTeams.map((set, i) =>
      i === index
        ? {
            sportId: patch.sportId ?? set.sportId,
            teamIds: patch.teamIds ?? set.teamIds ?? [],
          }
        : set,
    );
    setValue("sportTeams", next, { shouldDirty: true, shouldValidate: true });
  }

  function setSport(index: number, sportId: SportId) {
    updateSet(index, { sportId, teamIds: [] });
  }

  function toggleTeam(index: number, teamId: string) {
    const current = sportTeams[index]?.teamIds ?? [];
    const teamIds = current.includes(teamId)
      ? current.filter((id) => id !== teamId)
      : [...current, teamId];
    updateSet(index, { teamIds });
  }

  function addSet() {
    const nextSport =
      sports.find((sport) => !usedSportIds.has(sport.id))?.id ?? "other";
    setValue(
      "sportTeams",
      [...sportTeams, { sportId: nextSport, teamIds: [] }],
      { shouldDirty: true, shouldValidate: true },
    );
  }

  function removeSet(index: number) {
    if (sportTeams.length <= 1) return;
    setValue(
      "sportTeams",
      sportTeams.filter((_, i) => i !== index),
      { shouldDirty: true, shouldValidate: true },
    );
  }

  function toggleTag(tagId: string) {
    const next = tagIds.includes(tagId)
      ? tagIds.filter((id) => id !== tagId)
      : [...tagIds, tagId];
    setValue("tagIds", next, { shouldDirty: true });
  }

  const canAddSet = sports.some((sport) => !usedSportIds.has(sport.id));

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
      className={cn("flex flex-col gap-5", className)}
    >
      <div className="bg-muted/40 rounded-lg border px-3 py-3">
        <p className="text-sm font-medium">{placeDraft.name}</p>
        <p className="text-muted-foreground mt-1 text-xs">{placeDraft.address}</p>
      </div>

      <ImagePicker
        value={images}
        onChange={(next) => setValue("images", next, { shouldDirty: true })}
        disabled={submitting}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">태그</p>
        {tagsByCategory.map((group) => (
          <div key={group.category} className="flex items-start gap-2">
            <p className="text-muted-foreground mt-1.5 w-12 shrink-0 text-xs font-medium">
              {group.label}
            </p>
            <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
              {group.tags.map((tag) => {
                const selected = tagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                  >
                    <Badge variant={selected ? "default" : "outline"}>
                      {tag.label}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">종목 · 팀</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSet}
            disabled={!canAddSet}
          >
            <Plus data-icon="inline-start" />
            종목 추가
          </Button>
        </div>
        <p className="text-muted-foreground text-xs">
          종목마다 팀을 따로 고릅니다. 같은 종목은 한 번만 추가할 수 있습니다.
        </p>

        {sportTeams.map((set, index) => {
          const teamOptions = teams.filter((team) => team.sportId === set.sportId);
          const selectedTeamIds = set.teamIds ?? [];

          return (
            <div
              key={`${set.sportId}-${index}`}
              className="space-y-1 rounded-lg border px-4 py-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-muted-foreground text-xs font-medium">
                  종목 {index + 1}
                </p>
                {sportTeams.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`${index + 1}번째 종목 삭제`}
                    onClick={() => removeSet(index)}
                  >
                    <Trash2 />
                  </Button>
                )}
              </div>

              <div className="flex items-start gap-2">
                <p className="text-muted-foreground mt-1.5 w-9 shrink-0 text-xs font-medium">
                  종목 <span className="text-destructive">*</span>
                </p>
                <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                  {sports.map((sport) => {
                    const selected = set.sportId === sport.id;
                    const takenByOther =
                      !selected && usedSportIds.has(sport.id);
                    return (
                      <button
                        key={sport.id}
                        type="button"
                        disabled={takenByOther}
                        onClick={() => setSport(index, sport.id)}
                        className={cn(takenByOther && "opacity-40")}
                      >
                        <Badge variant={selected ? "default" : "outline"}>
                          {sport.name}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </div>

              {teamOptions.length > 0 && (
                <div className="flex items-start gap-2">
                  <p className="text-muted-foreground mt-1.5 w-9 shrink-0 text-xs font-medium">
                    팀
                  </p>
                  <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                    {teamOptions.map((team) => {
                      const selected = selectedTeamIds.includes(team.id);
                      return (
                        <button
                          key={team.id}
                          type="button"
                          onClick={() => toggleTeam(index, team.id)}
                        >
                          <Badge variant={selected ? "default" : "outline"}>
                            {team.name}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {errors.sportTeams && (
          <p className="text-destructive text-xs" role="alert">
            {errors.sportTeams.message ?? "종목·팀을 확인해 주세요."}
          </p>
        )}
      </div>

      <FormField control={control} name="watchedAt" label="방문일" required>
        {(field) => (
          <Input
            id="watchedAt"
            type="date"
            name={field.name}
            ref={field.ref}
            onBlur={field.onBlur}
            onChange={field.onChange}
            value={typeof field.value === "string" ? field.value : ""}
            disabled={field.disabled}
          />
        )}
      </FormField>

      <FormField control={control} name="review" label="후기" required>
        {(field) => (
          <Textarea
            id="review"
            rows={4}
            name={field.name}
            ref={field.ref}
            onBlur={field.onBlur}
            onChange={field.onChange}
            value={typeof field.value === "string" ? field.value : ""}
            disabled={field.disabled}
            placeholder="분위기, 화면, 좌석 등 다녀온 경험을 남겨 주세요."
          />
        )}
      </FormField>

      <p className="text-muted-foreground text-xs">
        이 장소에 다녀온 경험을 남겨 주세요. 매장 사정은 날마다 달라질 수 있으니
        방문 전 매장에 확인해 주세요.
      </p>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            장소 다시 선택
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

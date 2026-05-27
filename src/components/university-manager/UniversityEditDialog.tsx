import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import { apiGet, showApiToast } from "../../lib/api";
import { queryKeys } from "../../lib/queryKeys";
import {
  buildUniversityPayload,
  TAG_GROUPS,
  universityToFormState,
  validateUniversityForm,
  type UniversityFormState,
} from "./universityFormUtils";
import {
  updateUniversity,
  uploadUniversityGallery,
} from "../../lib/services/universityManagerService";
import { ImageDropzone } from "./ImageDropzone";
import { LocationMapPicker } from "./LocationMapPicker";
import type { University } from "../../types";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-900";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface UniversityEditDialogProps {
  university: University;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UniversityEditDialog({
  university,
  open,
  onOpenChange,
}: UniversityEditDialogProps) {
  const queryClient = useQueryClient();
  const universityId = university._id ?? university.id ?? "";

  const [form, setForm] = useState<UniversityFormState>(() =>
    universityToFormState(university)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [coverFiles, setCoverFiles] = useState<File[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  useEffect(() => {
    if (open) {
      setForm(universityToFormState(university));
      setErrors({});
      setCoverFiles([]);
      setGalleryFiles([]);
    }
  }, [open, university]);

  const { data: cities = [] } = useQuery({
    queryKey: ["cities-list-manager"],
    queryFn: async () => {
      const res = await apiGet<{
        data: { cities: { _id: string; name: string }[] };
      }>("/cities?limit=100&sort=name&fields=_id,name");
      return res.data?.cities ?? [];
    },
    enabled: open,
    staleTime: 5 * 60_000,
  });

  const set = (k: keyof UniversityFormState, v: string | boolean | string[]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const saveMutation = useMutation({
    mutationFn: async () => {
      await updateUniversity(universityId, buildUniversityPayload(form));
      if (coverFiles.length || galleryFiles.length) {
        await uploadUniversityGallery(universityId, {
          cover: coverFiles[0],
          gallery: galleryFiles,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.managedUniversity() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.managerUniversity(universityId),
      });
      showApiToast("University updated");
      onOpenChange(false);
    },
    onError: (err: Error) => showApiToast(err.message || "Update failed"),
  });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateUniversityForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    saveMutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
        aria-hidden
      />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Edit university
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-8"
        >
          <section className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">Basic info</h3>
            <Field label="Name *" error={errors.name}>
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </Field>
            <Field label="City *" error={errors.city}>
              <select
                className={inputClass}
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
              >
                <option value="">Select city</option>
                {cities.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Overview *" error={errors.overview}>
              <textarea
                className={cnTextarea}
                rows={4}
                value={form.overview}
                onChange={(e) => set("overview", e.target.value)}
              />
            </Field>
            <Field label="Wikipedia link *" error={errors.wikipediaLink}>
              <input
                className={inputClass}
                value={form.wikipediaLink}
                onChange={(e) => set("wikipediaLink", e.target.value)}
              />
            </Field>
            <Field label="Best known for (comma-separated)">
              <input
                className={inputClass}
                value={form.bestKnownFor}
                onChange={(e) => set("bestKnownFor", e.target.value)}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => set("isFeatured", e.target.checked)}
              />
              Featured university
            </label>
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-600">Tags</p>
              {TAG_GROUPS.map((group) => (
                <div key={group.label} className="flex flex-wrap gap-2">
                  <span className="text-xs text-slate-500 w-full">{group.label}</span>
                  {group.tags.map((tag) => (
                    <label
                      key={tag.value}
                      className="flex items-center gap-1 rounded-lg border px-2 py-1 text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={form.tags.includes(tag.value)}
                        onChange={() => {
                          set(
                            "tags",
                            form.tags.includes(tag.value)
                              ? form.tags.filter((t) => t !== tag.value)
                              : [...form.tags, tag.value]
                          );
                        }}
                      />
                      {tag.label}
                    </label>
                  ))}
                </div>
              ))}
            </div>
            <LocationMapPicker
              latitude={form.latitude}
              longitude={form.longitude}
              onLatitudeChange={(v) => set("latitude", v)}
              onLongitudeChange={(v) => set("longitude", v)}
              locationError={errors.location}
            />
          </section>

          <section className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Academic & contact
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Abbreviation">
                <input
                  className={inputClass}
                  value={form.abbreviation}
                  onChange={(e) => set("abbreviation", e.target.value)}
                />
              </Field>
              <Field label="Year founded">
                <input
                  className={inputClass}
                  type="number"
                  value={form.yearFounded}
                  onChange={(e) => set("yearFounded", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Website *" error={errors.websiteUrl}>
              <input
                className={inputClass}
                value={form.websiteUrl}
                onChange={(e) => set("websiteUrl", e.target.value)}
              />
            </Field>
            <Field label="Emails (comma-separated)">
              <input
                className={inputClass}
                value={form.emails}
                onChange={(e) => set("emails", e.target.value)}
              />
            </Field>
            <Field label="Phones (comma-separated)">
              <input
                className={inputClass}
                value={form.phoneNumbers}
                onChange={(e) => set("phoneNumbers", e.target.value)}
              />
            </Field>
            <Field label="Address city *" error={errors.addressCity}>
              <input
                className={inputClass}
                value={form.addressCity}
                onChange={(e) => set("addressCity", e.target.value)}
              />
            </Field>
            <Field label="Street">
              <input
                className={inputClass}
                value={form.addressStreet}
                onChange={(e) => set("addressStreet", e.target.value)}
              />
            </Field>
          </section>

          <section className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">Social links</h3>
            {(
              [
                ["telegram", "Telegram"],
                ["linkedIn", "LinkedIn"],
                ["facebook", "Facebook"],
                ["youtube", "YouTube"],
                ["instagram", "Instagram"],
                ["tiktok", "TikTok"],
                ["x", "X / Twitter"],
              ] as const
            ).map(([key, label]) => (
              <Field key={key} label={label}>
                <input
                  className={inputClass}
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                />
              </Field>
            ))}
          </section>

          <section className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">Media</h3>
            <ImageDropzone
              label="Cover image"
              maxFiles={1}
              files={coverFiles}
              onChange={setCoverFiles}
            />
            <ImageDropzone
              label="Gallery images"
              maxFiles={10}
              files={galleryFiles}
              onChange={setGalleryFiles}
            />
          </section>
        </form>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4 dark:border-white/10">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saveMutation.isPending}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            {saveMutation.isPending && <Loader2 className="size-4 animate-spin" />}
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

const cnTextarea = `${inputClass} resize-y min-h-[100px]`;

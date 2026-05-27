import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { apiGet, showApiToast } from "../../lib/api";
import { queryKeys } from "../../lib/queryKeys";
import {
  createCampus,
  deleteCampus,
  fetchUniversityCampuses,
  updateCampus,
  uploadCampusGallery,
  type ManagedCampus,
} from "../../lib/services/universityManagerService";
import { ImageDropzone } from "./ImageDropzone";
import { LocationMapPicker } from "./LocationMapPicker";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-900";

interface CampusFormState {
  name: string;
  overview: string;
  wikipediaLink: string;
  websiteUrl: string;
  addressCity: string;
  addressStreet: string;
  addressPoBox: string;
  latitude: string;
  longitude: string;
  emails: string;
  phoneNumbers: string;
  faxes: string;
  programIds: string[];
}

const EMPTY: CampusFormState = {
  name: "",
  overview: "",
  wikipediaLink: "",
  websiteUrl: "",
  addressCity: "",
  addressStreet: "",
  addressPoBox: "",
  latitude: "",
  longitude: "",
  emails: "",
  phoneNumbers: "",
  faxes: "",
  programIds: [],
};

function fromCsv(value: string) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function campusId(c: ManagedCampus) {
  return c._id ?? c.id ?? "";
}

function campusToForm(c: ManagedCampus): CampusFormState {
  const coords = c.location?.coordinates;
  return {
    name: c.name ?? "",
    overview: c.overview ?? "",
    wikipediaLink: c.wikipediaLink ?? "",
    websiteUrl: c.contacts?.websiteUrl ?? "",
    addressCity: c.address?.city ?? "",
    addressStreet: c.address?.street ?? "",
    addressPoBox: c.address?.poBox ?? "",
    latitude: coords?.[1] != null ? String(coords[1]) : "",
    longitude: coords?.[0] != null ? String(coords[0]) : "",
    emails: c.contacts?.emails?.join(", ") ?? "",
    phoneNumbers: c.contacts?.phoneNumbers?.join(", ") ?? "",
    faxes: c.contacts?.faxes?.join(", ") ?? "",
    programIds:
      c.programs?.map((p) => p._id ?? p.id ?? "").filter(Boolean) ?? [],
  };
}

interface CampusManagementProps {
  universityId: string;
  universityName: string;
}

export function CampusManagement({
  universityId,
  universityName,
}: CampusManagementProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ManagedCampus | null>(null);
  const [form, setForm] = useState<CampusFormState>(EMPTY);
  const [coverFiles, setCoverFiles] = useState<File[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const campusesQuery = useQuery({
    queryKey: queryKeys.managerUniversityCampuses(universityId),
    queryFn: () => fetchUniversityCampuses(universityId),
  });

  const programsQuery = useQuery({
    queryKey: ["programs-list-manager"],
    queryFn: async () => {
      const res = await apiGet<{
        data: { programs: { _id: string; name: string }[] };
      }>("/programs?limit=500&sort=name");
      return res.data?.programs ?? [];
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = campusesQuery.data ?? [];
    if (!q) return list;
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.slug ?? "").toLowerCase().includes(q)
    );
  }, [campusesQuery.data, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setCoverFiles([]);
    setGalleryFiles([]);
    setDialogOpen(true);
  };

  const openEdit = (campus: ManagedCampus) => {
    setEditing(campus);
    setForm(campusToForm(campus));
    setCoverFiles([]);
    setGalleryFiles([]);
    setDialogOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name.trim(),
        overview: form.overview.trim(),
        wikipediaLink: form.wikipediaLink.trim(),
        address: {
          city: form.addressCity.trim(),
          street: form.addressStreet.trim() || undefined,
          poBox: form.addressPoBox.trim() || undefined,
        },
        contacts: {
          websiteUrl: form.websiteUrl.trim() || undefined,
          emails: fromCsv(form.emails),
          phoneNumbers: fromCsv(form.phoneNumbers),
          faxes: fromCsv(form.faxes),
        },
        location: {
          type: "Point",
          coordinates: [Number(form.longitude), Number(form.latitude)],
        },
        programs: form.programIds,
      };

      let campus: ManagedCampus;
      if (editing) {
        campus = await updateCampus(
          universityId,
          campusId(editing),
          payload
        );
      } else {
        campus = await createCampus(universityId, payload);
      }

      const id = campusId(campus);
      if (id && (coverFiles.length || galleryFiles.length)) {
        await uploadCampusGallery(universityId, id, {
          cover: coverFiles[0],
          gallery: galleryFiles,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.managerUniversityCampuses(universityId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.managedUniversity() });
      showApiToast(editing ? "Campus updated" : "Campus created");
      setDialogOpen(false);
    },
    onError: (err: Error) => showApiToast(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCampus(universityId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.managerUniversityCampuses(universityId),
      });
      showApiToast("Campus deleted");
    },
    onError: (err: Error) => showApiToast(err.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Campuses for {universityName}
        </p>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2 text-sm font-bold text-white"
        >
          <Plus className="size-4" />
          Add campus
        </button>
      </div>

      <input
        className={inputClass}
        placeholder="Search campuses…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {campusesQuery.isLoading ? (
        <p className="text-sm text-slate-500">Loading campuses…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-slate-500">No campuses found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-4 py-2 text-left font-bold">Name</th>
                <th className="px-4 py-2 text-left font-bold">Programs</th>
                <th className="px-4 py-2 text-left font-bold">Rating</th>
                <th className="px-4 py-2 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((campus) => (
                <tr
                  key={campusId(campus)}
                  className="border-t border-slate-100 dark:border-white/5"
                >
                  <td className="px-4 py-3 font-medium">{campus.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {campus.programs?.length ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    {campus.ratingsAverage != null
                      ? campus.ratingsAverage.toFixed(1)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(campus)}
                      className="mr-2 inline-flex rounded-lg p-2 hover:bg-slate-100"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          confirm(`Delete campus "${campus.name}"?`)
                        ) {
                          deleteMutation.mutate(campusId(campus));
                        }
                      }}
                      className="inline-flex rounded-lg p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {dialogOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDialogOpen(false)}
          />
          <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
            <h3 className="mb-4 text-lg font-black">
              {editing ? "Edit campus" : "New campus"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold">Name *</label>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-xs font-bold">Overview *</label>
                <textarea
                  className={`${inputClass} min-h-[80px]`}
                  value={form.overview}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, overview: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-xs font-bold">Wikipedia *</label>
                <input
                  className={inputClass}
                  value={form.wikipediaLink}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, wikipediaLink: e.target.value }))
                  }
                />
              </div>
              <LocationMapPicker
                latitude={form.latitude}
                longitude={form.longitude}
                onLatitudeChange={(v) =>
                  setForm((f) => ({ ...f, latitude: v }))
                }
                onLongitudeChange={(v) =>
                  setForm((f) => ({ ...f, longitude: v }))
                }
              />
              <div>
                <label className="text-xs font-bold">Programs</label>
                <div className="mt-2 max-h-40 overflow-y-auto space-y-1 rounded-xl border p-3">
                  {(programsQuery.data ?? []).map((p) => (
                    <label key={p._id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.programIds.includes(p._id)}
                        onChange={() => {
                          setForm((f) => ({
                            ...f,
                            programIds: f.programIds.includes(p._id)
                              ? f.programIds.filter((id) => id !== p._id)
                              : [...f.programIds, p._id],
                          }));
                        }}
                      />
                      {p.name}
                    </label>
                  ))}
                </div>
              </div>
              <ImageDropzone
                label="Cover"
                maxFiles={1}
                files={coverFiles}
                onChange={setCoverFiles}
              />
              <ImageDropzone
                label="Gallery"
                maxFiles={10}
                files={galleryFiles}
                onChange={setGalleryFiles}
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="rounded-xl px-4 py-2 text-sm font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saveMutation.isPending}
                onClick={() => saveMutation.mutate()}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2 text-sm font-bold text-white"
              >
                {saveMutation.isPending && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

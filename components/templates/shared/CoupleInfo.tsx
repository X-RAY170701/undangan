import type { InvitationData } from "@/types/invitation";
import type { WeddingTheme } from "../themes";
import { GununganSilhouette } from "./GununganSilhouette";

interface CoupleInfoProps {
  data: InvitationData;
  theme: WeddingTheme;
}

function Circle({
  name,
  fullName,
  parents,
  theme,
}: {
  name: string;
  fullName: string;
  parents: string;
  theme: WeddingTheme;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2 text-center">
      {/* Catatan: dulu ada lingkaran border kosong di sini (placeholder foto per-mempelai),
       * tapi InvitationData tidak punya field foto per-orang — cuma coverPhotoUrl gabungan.
       * Menampilkan lingkaran kosong tanpa isi terlihat seperti bug/belum selesai, jadi
       * dihapus. Kalau nanti ada field foto per-mempelai, tinggal render <img>/<Image> di sini. */}
      <h3 className={`${theme.headingFont} text-2xl ${theme.headingText}`}>
        {fullName || name || "-"}
      </h3>
      {parents ? (
        <p className="max-w-[220px] text-sm text-neutral-400">
          Putra/Putri dari {parents}
        </p>
      ) : null}
    </div>
  );
}

function ClassicCoupleInfo({ data, theme }: CoupleInfoProps) {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-10 px-6 py-16 sm:flex-row sm:justify-center sm:gap-6">
      <Circle
        name={data.groomName}
        fullName={data.groomFullName}
        parents={data.groomParents}
        theme={theme}
      />
      <span className={`font-serif text-3xl ${theme.ampersand}`}>&amp;</span>
      <Circle
        name={data.brideName}
        fullName={data.brideFullName}
        parents={data.brideParents}
        theme={theme}
      />
    </section>
  );
}

function ModernSplitCoupleInfo({ data, theme }: CoupleInfoProps) {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-6 py-16 sm:flex-row sm:justify-center sm:gap-0">
      <div className="flex flex-1 flex-col items-center gap-2 text-center sm:items-end sm:pr-8 sm:text-right">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
          Mempelai Pria
        </p>
        <h3 className={`${theme.headingFont} text-2xl ${theme.headingText}`}>
          {data.groomFullName || data.groomName || "-"}
        </h3>
        {data.groomParents ? (
          <p className="max-w-[220px] text-sm text-neutral-400">
            Putra dari {data.groomParents}
          </p>
        ) : null}
      </div>
      <div className="hidden h-20 w-px bg-white/15 sm:block" />
      <div className="block h-px w-16 bg-white/15 sm:hidden" />
      <div className="flex flex-1 flex-col items-center gap-2 text-center sm:items-start sm:pl-8 sm:text-left">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
          Mempelai Wanita
        </p>
        <h3 className={`${theme.headingFont} text-2xl ${theme.headingText}`}>
          {data.brideFullName || data.brideName || "-"}
        </h3>
        {data.brideParents ? (
          <p className="max-w-[220px] text-sm text-neutral-400">
            Putri dari {data.brideParents}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function OrganicCoupleInfo({ data, theme }: CoupleInfoProps) {
  return (
    <section className={`px-6 py-16 ${theme.altSectionBg}`}>
      <div
        className={`mx-auto flex max-w-md flex-col items-center gap-4 rounded-t-[3rem] rounded-b-2xl border px-8 py-10 text-center ${theme.countdownBox}`}
      >
        <h3 className={`${theme.headingFont} text-2xl ${theme.headingText}`}>
          {data.groomFullName || data.groomName || "-"}
        </h3>
        {data.groomParents ? (
          <p className="text-sm text-neutral-400">
            Putra dari {data.groomParents}
          </p>
        ) : null}
        <theme.icon className={`h-5 w-5 ${theme.ampersand}`} />
        <h3 className={`${theme.headingFont} text-2xl ${theme.headingText}`}>
          {data.brideFullName || data.brideName || "-"}
        </h3>
        {data.brideParents ? (
          <p className="text-sm text-neutral-400">
            Putri dari {data.brideParents}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function OrnateFrameCoupleInfo({ data, theme }: CoupleInfoProps) {
  return (
    <section className="mx-auto max-w-lg px-6 py-16 text-center">
      <div className={`rounded-lg border-2 border-double p-8 ${theme.countdownBox}`}>
        <p
          className={`${theme.headingFont} text-lg ${theme.headingText}`}
        >
          {data.groomFullName || data.groomName || "-"}
        </p>
        {data.groomParents ? (
          <p className="mt-1 text-xs uppercase tracking-wide text-neutral-400">
            Putra dari {data.groomParents}
          </p>
        ) : null}
        <div className={`mx-auto my-4 h-px w-24 ${theme.ampersand} bg-current opacity-50`} />
        <p
          className={`${theme.headingFont} text-lg ${theme.headingText}`}
        >
          {data.brideFullName || data.brideName || "-"}
        </p>
        {data.brideParents ? (
          <p className="mt-1 text-xs uppercase tracking-wide text-neutral-400">
            Putri dari {data.brideParents}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function EditorialSplitCoupleInfo({ data, theme }: CoupleInfoProps) {
  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
            Mempelai Pria
          </p>
          <h3
            className={`${theme.namesFont} text-3xl font-bold leading-tight ${theme.headingText}`}
          >
            {data.groomFullName || data.groomName || "-"}
          </h3>
          {data.groomParents ? (
            <p className="mt-2 text-xs uppercase tracking-wide text-neutral-400">
              Putra dari {data.groomParents}
            </p>
          ) : null}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
            Mempelai Wanita
          </p>
          <h3
            className={`${theme.namesFont} text-3xl font-bold leading-tight ${theme.headingText}`}
          >
            {data.brideFullName || data.brideName || "-"}
          </h3>
          {data.brideParents ? (
            <p className="mt-2 text-xs uppercase tracking-wide text-neutral-400">
              Putri dari {data.brideParents}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ScrapbookCoupleInfo({ data, theme }: CoupleInfoProps) {
  return (
    <section className={`px-6 py-16 ${theme.altSectionBg}`}>
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <div
          className={`flex -rotate-2 flex-col items-center gap-1.5 rounded-sm border px-6 py-5 text-center ${theme.countdownBox}`}
        >
          <h3 className={`${theme.namesFont} text-2xl ${theme.headingText}`}>
            {data.groomFullName || data.groomName || "-"}
          </h3>
          {data.groomParents ? (
            <p className="max-w-[200px] text-xs text-neutral-400">
              Putra dari {data.groomParents}
            </p>
          ) : null}
        </div>
        <div
          className={`flex rotate-2 flex-col items-center gap-1.5 rounded-sm border px-6 py-5 text-center ${theme.countdownBox}`}
        >
          <h3 className={`${theme.namesFont} text-2xl ${theme.headingText}`}>
            {data.brideFullName || data.brideName || "-"}
          </h3>
          {data.brideParents ? (
            <p className="max-w-[200px] text-xs text-neutral-400">
              Putri dari {data.brideParents}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Star3DCoupleInfo({ data, theme }: CoupleInfoProps) {
  return (
    <section className="mx-auto max-w-lg px-6 py-16 text-center">
      <div className={`rounded-2xl border p-8 ${theme.countdownBox}`}>
        <p className={`${theme.headingFont} text-xl ${theme.headingText}`}>
          {data.groomFullName || data.groomName || "-"}
        </p>
        {data.groomParents ? (
          <p className="mt-1 text-xs uppercase tracking-wide text-neutral-400">
            Putra dari {data.groomParents}
          </p>
        ) : null}
        <div className={`mx-auto my-5 h-px w-16 ${theme.ampersand} bg-current opacity-50`} />
        <p className={`${theme.headingFont} text-xl ${theme.headingText}`}>
          {data.brideFullName || data.brideName || "-"}
        </p>
        {data.brideParents ? (
          <p className="mt-1 text-xs uppercase tracking-wide text-neutral-400">
            Putri dari {data.brideParents}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function GateCoupleInfo({ data, theme }: CoupleInfoProps) {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-16 text-center">
      <h3 className={`${theme.headingFont} text-2xl ${theme.headingText}`}>
        {data.groomFullName || data.groomName || "-"}
      </h3>
      {data.groomParents ? (
        <p className="text-sm text-neutral-400">
          Putra dari {data.groomParents}
        </p>
      ) : null}
      <GununganSilhouette className={`h-10 w-8 ${theme.ampersand}`} />
      <h3 className={`${theme.headingFont} text-2xl ${theme.headingText}`}>
        {data.brideFullName || data.brideName || "-"}
      </h3>
      {data.brideParents ? (
        <p className="text-sm text-neutral-400">
          Putri dari {data.brideParents}
        </p>
      ) : null}
    </section>
  );
}

export function CoupleInfo({ data, theme }: CoupleInfoProps) {
  switch (theme.layout) {
    case "modern-split":
      return <ModernSplitCoupleInfo data={data} theme={theme} />;
    case "organic":
      return <OrganicCoupleInfo data={data} theme={theme} />;
    case "ornate-frame":
      return <OrnateFrameCoupleInfo data={data} theme={theme} />;
    case "editorial-split":
      return <EditorialSplitCoupleInfo data={data} theme={theme} />;
    case "scrapbook":
      return <ScrapbookCoupleInfo data={data} theme={theme} />;
    case "gate":
      return <GateCoupleInfo data={data} theme={theme} />;
    case "3d-starlight":
      return <Star3DCoupleInfo data={data} theme={theme} />;
    case "classic":
    default:
      return <ClassicCoupleInfo data={data} theme={theme} />;
  }
}

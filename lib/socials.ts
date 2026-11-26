import suppliedSocials from "../data/socials.json";
import newsSources from "../data/news-sources.json";

export const NEWS_SOURCES = newsSources;
export type NewsSource = (typeof NEWS_SOURCES)[number];
export type SocialNetwork = "facebook" | "instagram" | "tiktok" | "youtube" | "linkedin";
export type SocialLink = { network: SocialNetwork; label: string; handle: string; href: string };
export const networkLabels: Record<SocialNetwork, string> = { facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube", linkedin: "LinkedIn" };

function socialLinks(source: { label: string } & Partial<Record<SocialNetwork, string>>): SocialLink[] {
  return (Object.keys(networkLabels) as SocialNetwork[]).flatMap((network) => {
    const href = source[network];
    if (!href) return [];
    const path = new URL(href).pathname.split("/").filter(Boolean);
    const opaque = path[0] === "share" || path[0] === "profile.php" || network === "linkedin";
    const handle = opaque ? source.label : path[path.length - 1] ?? source.label;
    return [{ network, label: networkLabels[network], handle: handle.startsWith("@") || opaque || network === "facebook" ? handle : `@${handle}`, href }];
  });
}

export const sourceForFaculty = (facultyId: string) => NEWS_SOURCES.find((source) => source.facultyId === facultyId);
export function socialsForFaculty(facultyId: string) {
  const source = sourceForFaculty(facultyId);
  return source ? suppliedSocials.faculties.find((faculty) => faculty.key === source.key) : undefined;
}
export const universitySocials = socialLinks(suppliedSocials.university);
export const socialSources = [
  { key: "university", label: suppliedSocials.university.label, links: universitySocials.filter((link) => link.network !== "linkedin") },
  ...suppliedSocials.faculties.map((faculty) => ({ key: faculty.key, label: faculty.label, links: socialLinks(faculty) })),
];
export const facultySocialLinks = (facultyId: string) => {
  const faculty = socialsForFaculty(facultyId);
  return faculty ? socialLinks(faculty) : [];
};

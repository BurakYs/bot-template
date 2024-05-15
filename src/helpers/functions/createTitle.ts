export default function (title: string | null | undefined, defaultTitle: string, emoji: string) {
    if (title?.includes(':')) return title;

    if (Math.random() < 0.9) {
        title ||= defaultTitle;
        title = Math.random() < 0.5 ? title + ` ${emoji}` : `${emoji} ` + title;
    } else if (Math.random() < 0.25) {
        title = null;
    }

    return title;
}
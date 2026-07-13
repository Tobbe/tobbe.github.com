import { html } from "@mastrojs/mastro";

function getEnglishDate(date: Date) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function PostMeta(props: {
  lastModified: Date;
  readingTimeMinutes: number;
}) {
  return html`<div>
    Last modified:
    <time datetime="${props.lastModified.toISOString()}">
      ${getEnglishDate(props.lastModified)}
    </time>
    &bull; Reading time: ${props.readingTimeMinutes} minutes
  </div>`;
}

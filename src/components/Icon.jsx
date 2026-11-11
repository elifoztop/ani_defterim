const PATHS = {
  crown: 'M4 18 3 8l5 4 4-7 4 7 5-4-1 10Z M4 21h16',
  undo: 'M9 14 4 9l5-5 M4 9h10.5a5.5 5.5 0 0 1 0 11H11',
  redo: 'M15 14l5-5-5-5 M20 9H9.5a5.5 5.5 0 0 0 0 11H13',
  photo: 'M4 7h3l2-3h6l2 3h3v13H4Z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  sticker: 'M15.5 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h9.5L21 15.5V6a3 3 0 0 0-3-3h-2.5 M21 15h-3.5a2.5 2.5 0 0 0-2.5 2.5V21 M9 10h.01 M15 10h.01 M9 14.5c1.5 1.5 4.5 1.5 6 0',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7Z',
  text: 'M5 6V4h14v2 M12 4v16 M9 20h6',
  sliders: 'M4 6h10 M18 6h2 M4 12h4 M12 12h8 M4 18h10 M18 18h2 M16 4v4 M10 10v4 M16 16v4',
  trash: 'M4 7h16 M10 11v6 M14 11v6 M6 7l1 13h10l1-13 M9 7V4h6v3',
  chevronLeft: 'M15 5l-7 7 7 7',
  chevronRight: 'M9 5l7 7-7 7',
  plus: 'M12 5v14 M5 12h14',
}

export default function Icon({ name, className = 'icon' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}

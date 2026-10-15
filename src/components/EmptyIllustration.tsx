export function EmptyIllustration({ cart = false }: { cart?: boolean }) {
  return (
    <svg
      className="empty-illustration"
      viewBox="0 0 240 210"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="120" cy="183" rx="73" ry="13" fill="#dfd2bb" />
      <g
        stroke="#768153"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M120 18v12m-32-4 6 11m58-11-6 11M63 47l10 7m100-7-10 7" />
        {cart ? (
          <>
            <path d="m48 61 27 3 22 89h76l23-72-115-8" fill="#efe9d7" />
            <path d="m91 103 95 6m-88 20 80 5m-62-57 5 75m29-73-7 73m-48 1-7 14h89" />
            <circle cx="106" cy="177" r="8" fill="#768153" />
            <circle cx="164" cy="177" r="8" fill="#768153" />
          </>
        ) : (
          <>
            <path
              d="m75 83-8 88q44 20 88 0l-8-88Z"
              fill="#e0c8a4"
              stroke="#c8b18e"
            />
            <path d="M92 93V76a20 20 0 0 1 40 0v17" stroke="#c8b18e" />
            <circle cx="156" cy="79" r="34" fill="#f6f3e7" />
            <path
              d="m181 105 27 27M142 79l13 7 15-8-14-8Zm0 0v16l13 7 15-8V78m-15 8v16"
              strokeWidth="4"
            />
          </>
        )}
      </g>
      <g fill="#8a9566">
        <path d="M64 167Q28 152 39 122q29 10 25 45M184 166q33-3 35-35-29 1-35 35M81 182q-33 2-39-17 26-8 39 17" />
        {!cart && (
          <path d="M111 153q-29-4-23-27 23 3 23 27m2 5q-2-28 24-29 3 24-24 29" />
        )}
      </g>
    </svg>
  );
}

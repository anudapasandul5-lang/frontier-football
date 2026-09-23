/* Rolling label for buttons and links: on hover the text slides up and an
   identical copy rolls in from below (CSS in globals.css, fine pointers with
   motion on only). The copy is aria-hidden, so the name is read once. */
export function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <span className="roll__in">
        {children}
        <span aria-hidden="true" className="roll__copy">
          {children}
        </span>
      </span>
    </span>
  );
}

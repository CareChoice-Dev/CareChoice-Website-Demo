/**
 * Wraps content with a scroll-reveal (rise + fade as it enters the viewport).
 *
 * Implemented purely in CSS via scroll-driven animations (see `.cc-reveal` in
 * styles.css) — no JS, no hydration dependency. Content is visible by default
 * and only animates in browsers that support `animation-timeline: view()`;
 * everywhere else it simply shows. Safe to use as a server component.
 */
export function Reveal({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`cc-reveal ${className}`}>{children}</div>
}

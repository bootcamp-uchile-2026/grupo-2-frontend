import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

type Props = {
  kind: string;
  desktopCount: number;
  gap: number;
  children: ReactNode;
};

export function Carousel({ kind, desktopCount, gap, children }: Props) {

  const [page, setPage] = useState(0),
    [width, setWidth] = useState(window.innerWidth),
    [viewport, setViewport] = useState(0),
    [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null),
    touch = useRef(0);
  const offer = kind === 'offer';
  const count = offer ? 5 : kind === 'popular' ? 6 : 10;
  const visible = offer
    ? 1
    : width <= 480
      ? 1
      : width <= 800
        ? 2
        : desktopCount;
  const max = Math.ceil(count / visible) - 1;
  const current = Math.min(page, max);

  const move = (delta: number) =>
    setPage((p) =>
      offer
        ? (p + delta + count) % count
        : Math.max(0, Math.min(p + delta, max)),
    );

  useEffect(() => {

    const resize = () => {

      setWidth(window.innerWidth);

      setViewport(
        ref.current?.querySelector(`.${kind}-viewport`)?.clientWidth || 0,
      );
    };

    resize();

    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, [kind]);

  useEffect(() => {

    if (!offer || paused) return;

    const timer = setInterval(() => setPage((p) => (p + 1) % count), 4500);

    return () => clearInterval(timer);
  }, [offer, paused, count]);

  function decorate(nodes: ReactNode): ReactNode {

    return Children.map(nodes, (node, index) => {

      if (!isValidElement<Record<string, unknown>>(node)) return node;

      const props = node.props;
      const cls = String(props.className || '');
      const extra: Record<string, unknown> = {};

      if (cls.split(' ').includes(`${kind}-track`))
        extra.style = {
          transform: offer
            ? `translateX(-${current * 100}%)`
            : `translateX(-${current * (viewport + gap)}px)`,
        };

      if (cls.includes(offer ? 'carousel-arrow prev' : `${kind}-prev`)) {
        extra.onClick = () => move(-1);

        if (!offer) extra.disabled = current === 0;
      }

      if (cls.includes(offer ? 'carousel-arrow next' : `${kind}-next`)) {
        extra.onClick = () => move(1);

        if (!offer) extra.disabled = current === max;
      }

      if (cls.includes('offer-slide'))
        extra.className = `offer-slide${index === current ? ' active' : ''}`;

      if (cls === 'carousel-dots')
        return cloneElement(
          node,
          {},
          Children.map(props.children as ReactNode, (dot, i) =>
            isValidElement(dot)
              ? cloneElement(
                  dot as React.ReactElement<Record<string, unknown>>,
                  {
                    className: i === current ? 'active' : '',
                    onClick: () => setPage(i),
                  },
                )
              : dot,
          ),
        );

      return cloneElement(node, extra, decorate(props.children as ReactNode));
    });
  }

  return (
    <div
      ref={ref}
      className={`${kind}-carousel`}
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {

        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
      onKeyDown={(e) => {

        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();

          move(e.key === 'ArrowLeft' ? -1 : 1);
        }
      }}
      onTouchStart={(e) => {

        touch.current = e.touches[0].clientX;

        setPaused(true);
      }}
      onTouchEnd={(e) => {

        const distance = e.changedTouches[0].clientX - touch.current;

        if (Math.abs(distance) > 45) move(distance < 0 ? 1 : -1);

        setPaused(false);
      }}
    >
      {decorate(children)}
    </div>
  );
}

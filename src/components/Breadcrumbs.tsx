import { Link, type RouteName } from '../app/router';

interface BreadcrumbItem {
  label: string;
  to?: RouteName | undefined;
  params?: Record<string, string> | undefined;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Visual breadcrumbs tied to the local router.
 * The last item is rendered as the current page (not a link).
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Ruta de navegación">
      <ol className="breadcrumbs">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="breadcrumbs__item">
              {isLast || !item.to ? (
                <span className="breadcrumbs__current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link to={item.to} params={item.params}>
                    {item.label}
                  </Link>
                  <span className="breadcrumbs__sep" aria-hidden="true">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

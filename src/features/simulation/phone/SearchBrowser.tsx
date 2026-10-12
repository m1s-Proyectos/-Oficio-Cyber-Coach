import type { SearchQuery, SearchQueryId, SearchResult } from '../tiendaBrowse';
import { SEARCH_QUERIES } from '../tiendaBrowse';

export function SearchBrowser({
  queryId,
  results,
  loading,
  empty,
  onQuery,
  onOpenResult,
}: {
  queryId: SearchQueryId | null;
  results: readonly SearchResult[];
  loading: boolean;
  empty: boolean;
  onQuery: (query: SearchQuery) => void;
  onOpenResult: (result: SearchResult) => void;
}) {
  const active = SEARCH_QUERIES.find((item) => item.id === queryId);

  return (
    <div className="search-browser">
      <p className="search-browser__brand">BuscaYa</p>
      <div className="search-browser__bar" aria-label="Barra de búsqueda simulada">
        <span>{active?.label ?? 'Buscar en esta historia'}</span>
      </div>
      <div className="search-browser__chips" role="group" aria-label="Consultas de esta historia">
        {SEARCH_QUERIES.map((query) => (
          <button
            key={query.id}
            type="button"
            className="search-browser__chip"
            data-active={query.id === queryId}
            onClick={() => {
              onQuery(query);
            }}
          >
            {query.label}
          </button>
        ))}
      </div>
      {empty && !loading ? (
        <p className="search-browser__empty">
          Escribe con una consulta. No hay resultados todavía.
        </p>
      ) : null}
      {loading ? (
        <p className="search-browser__loading" aria-live="polite">
          Buscando en este ejercicio…
        </p>
      ) : null}
      {!loading && results.length > 0 ? (
        <ul className="search-browser__list">
          {results.map((result) => (
            <li key={result.id}>
              <button
                type="button"
                className="search-result"
                data-kind={result.kind}
                onClick={() => {
                  onOpenResult(result);
                }}
              >
                <span className="search-result__source">{result.source}</span>
                <span className="search-result__title">{result.title}</span>
                <span className="search-result__desc">{result.description}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

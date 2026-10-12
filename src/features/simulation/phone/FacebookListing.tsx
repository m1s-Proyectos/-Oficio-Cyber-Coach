import { FACEBOOK_CAPTION, FACEBOOK_COMMENTS } from '../tiendaBrowse';

export function FacebookListing({
  commentsOpen,
  onOpenComments,
}: {
  commentsOpen: boolean;
  onOpenComments: () => void;
}) {
  return (
    <div className="fb-post">
      <header className="fb-post__head">
        <span className="fb-post__avatar" aria-hidden="true">
          LM
        </span>
        <div>
          <p className="fb-post__name">Lumina Móvil</p>
          <p className="fb-post__meta">Publicación comercial · hace 2 h · El Salvador (ficción)</p>
        </div>
      </header>
      <p className="fb-post__caption">{FACEBOOK_CAPTION}</p>
      <div
        className="fb-post__photo"
        role="img"
        aria-label="Ilustración de un iPhone 14 de esta historia"
      >
        <div className="fb-iphone" aria-hidden="true">
          <span className="fb-iphone__notch" />
          <span className="fb-iphone__screen">14</span>
        </div>
        <p className="fb-post__price">$610</p>
      </div>
      {commentsOpen ? (
        <ul className="fb-post__comments">
          {FACEBOOK_COMMENTS.map((comment) => (
            <li key={comment.author}>
              <strong>{comment.author}</strong>
              <span>{comment.text}</span>
            </li>
          ))}
        </ul>
      ) : (
        <button type="button" className="fb-post__comments-btn" onClick={onOpenComments}>
          Ver comentarios
        </button>
      )}
    </div>
  );
}

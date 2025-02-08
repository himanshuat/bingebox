import { Title } from "../types";

interface MovieCardProps {
    title: Title;
}

function MovieCard({ title:
    { name, title, vote_average, poster_path, release_date, original_language, media_type }
}: MovieCardProps) {
    return (
        <div className="title-card">
            <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-poster.png'} alt={title} />

            <div className="mt-4">
                <h3>{title || name}</h3>

                <div className="content">
                    <div className="rating">
                        <img src="star.svg" alt="Star Icon" />
                        <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                    </div>

                    <span>•</span>
                    <p className="lang">{original_language}</p>

                    <span>•</span>
                    <p className="year">
                        {release_date ? release_date.split('-')[0] : 'N/A'}
                    </p>

                    {media_type && (
                        <>
                            <span>•</span>
                            <p className="media-type">{media_type}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MovieCard
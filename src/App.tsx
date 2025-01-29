import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { Movie } from "./types";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function App() {
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [movieList, setMovieList] = useState<Movie[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

	const fetchMovies = async (query: string = '') => {
		setIsLoading(true);

		try {
			const endpoint = query
				? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&api_key=${API_KEY}`
				: `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
			const response = await fetch(endpoint);
			if (!response.ok) {
				throw new Error('Failed to fetch movies');
			}

			const data = await response.json();
			if (data.Response === 'False') {
				setErrorMessage(data.Error || 'Failed to fetch movies');
				setMovieList([]);
				return;
			}

			setMovieList(data.results || []);
		} catch (error) {
			console.log(`Error fetching movies: ${error}`);
			setErrorMessage('Error fetching movies. Please try again later.')
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		fetchMovies(debouncedSearchTerm);
	}, [debouncedSearchTerm]);

	return (
		<main>
			<div className="pattern" />
			<div className="wrapper">
				<header>
					<img src="./hero.png" alt="Hero Banner" />
					<h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
					<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
				</header>
				<section className="all-movies">
					<h2 className="mt-[40px]">All Movies</h2>
					{isLoading ? (
						<Spinner />
					) : errorMessage ? (
						<p className="text-red-500">{errorMessage}</p>
					) : (
						<ul>
							{movieList.map((movie: Movie) => (
								<MovieCard key={movie.id} movie={movie} />
							))}
						</ul>
					)}
				</section>
			</div>
		</main>
	)
}

export default App

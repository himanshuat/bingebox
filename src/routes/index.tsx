import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { Title } from "../types";
import Search from "../components/Search";
import Spinner from "../components/Spinner";
import TitleCard from "../components/TitleCard";

export const Route = createFileRoute('/')({
	component: Index,
})

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function Index() {
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [titleList, setTitleList] = useState<Title[]>([]);
	const [trendingTitles, setTrendingTitles] = useState<Title[]>([]);

	useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

	const fetchTitles = async (query: string = '') => {
		setIsLoading(true);

		try {
			const endpoint = query
				? `${API_BASE_URL}/search/multi?query=${encodeURIComponent(query)}&api_key=${API_KEY}`
				: `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
			const response = await fetch(endpoint);
			if (!response.ok) {
				throw new Error('Failed to fetch titles');
			}

			const data = await response.json();
			if (data.Response === 'False') {
				setErrorMessage(data.Error || 'Failed to fetch titles');
				setTitleList([]);
				return;
			}

			setTitleList(data.results.filter((item: Title) => item.media_type === 'movie' || item.media_type === 'tv' || item.media_type === undefined) || []);
		} catch (error) {
			console.log(`Error fetching titles: ${error}`);
			setErrorMessage('Error fetching titles. Please try again later.')
		} finally {
			setIsLoading(false);
		}
	}

	const fetchTrendingTitles = async () => {
		try {
			const endpoint = `${API_BASE_URL}/trending/all/day?api_key=${API_KEY}`;
			const response = await fetch(endpoint);
			if (!response.ok) {
				console.log('Failed to fetch trending titles');
			}

			const data = await response.json();
			if (data.Response === 'False') {
				setErrorMessage(data.Error || 'Failed to fetch titles');
				setTrendingTitles([]);
				return;
			}

			setTrendingTitles(data.results?.filter((item: Title, index: number) => (item && index < 10)) || []);
		} catch (error) {
			console.log(`Error fetching trending titles: ${error}`);
		}
	}

	useEffect(() => {
		fetchTitles(debouncedSearchTerm);
	}, [debouncedSearchTerm]);

	useEffect(() => {
		fetchTrendingTitles();
	}, []);

	return (
		<>
			<div className="wrapper">
				<header>
					<img src="./hero.png" alt="Hero Banner" />
					<h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
					<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
				</header>

				{trendingTitles.length > 0 && (
					<section className="trending">
						<h2>Trending Today</h2>
						<ul>
							{trendingTitles.map((title: Title, index: number) => (
								<li key={title.id}>
									<p>{index + 1}</p>
									<img src={title.poster_path ? `https://image.tmdb.org/t/p/w500/${title.poster_path}` : '/no-poster.png'} alt={title.title} />
								</li>
							))}
						</ul>
					</section>
				)}

				<section className="all-titles">
					<h2>All Movies</h2>
					{isLoading ? (
						<Spinner />
					) : errorMessage ? (
						<p className="text-red-500">{errorMessage}</p>
					) : (
						<ul>
							{titleList.map((title: Title) => (
								<TitleCard key={title.id} title={title} />
							))}
						</ul>
					)}
				</section>
			</div>
		</>
	)
}
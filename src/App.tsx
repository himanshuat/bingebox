import { useState } from "react";
import Search from "./components/Search";

function App() {
	const [searchTerm, setsearchTerm] = useState('');

	return (
		<main>
			<div className="pattern" />
			<div className="wrapper">
				<header>
					<img src="./hero.png" alt="Hero Banner" />
					<h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
				</header>
				<Search searchTerm={searchTerm} setSearchTerm={setsearchTerm} />
				<h1>{searchTerm}</h1>
			</div>
		</main>
	)
}

export default App

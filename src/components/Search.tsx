interface SearchProps {
	searchTerm: string;
	setSearchTerm(value: string): void;
}

function Search({ searchTerm, setSearchTerm }: SearchProps) {
	return (
		<div className="search">
			<div>
				<img src="search.svg" alt="search" />
				<input
					type="text"
					placeholder="Search through thousands of movies"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>
		</div>
	)
}

export default Search;
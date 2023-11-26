function handleSearchInput() {
  const searchBar = document.getElementById('searchBar');
  const searchResults = document.getElementById('searchResultsDropdown');

  searchResults.style.display = 'none'; // Start with display: none

  let searchTerm = searchBar.value.trim().toLowerCase();

  if (searchTerm.length >= 1) {
    fetch(`/Thread/SearchPosts?searchQuery=${searchTerm}`)
      .then(response => response.json())
      .then(data => {
        // For testing purposes
        console.log(data);

        // Clear previous search results
        searchResults.innerHTML = '';

        if (data.length > 0) {
          // Create a dropdown or list to display the search results
          const resultList = document.createElement('ul');
          resultList.classList.add('search-results');

          // Loop through the search results and create list items
          data.forEach(result => {
            const listItem = document.createElement('li');
            listItem.textContent = result.threadTitle;

            // Add a click event to the list item to handle the redirection
            listItem.addEventListener('click', () => {
              const threadId = result.threadId;
              window.location.href = `/Thread/Thread?threadID=${threadId}`;
            });

            resultList.appendChild(listItem);
          });

          // Append the result list to the searchResults container
          searchResults.appendChild(resultList);

          // Display the results container
          searchResults.style.display = 'block';
        } else {
          searchResults.style.display = 'none'; // No results, hide the container
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  } else {
    searchResults.style.display = 'none';
  }
}

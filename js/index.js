document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('resultsContainer');
    const toggleSearchTypeBtn = document.getElementById('toggleSearchType');
  
    let currentSearchType = 'users'; // Default to searching for users
  
    searchForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const searchTerm = searchInput.value.trim();
      
      if (currentSearchType === 'users') {
        searchUsers(searchTerm);
      } else if (currentSearchType === 'repos') {
        searchRepos(searchTerm);
      }
    });
  
    toggleSearchTypeBtn.addEventListener('click', function() {
      if (currentSearchType === 'users') {
        currentSearchType = 'repos';
        searchInput.placeholder = 'Enter GitHub repo name...';
        toggleSearchTypeBtn.textContent = 'Search Repos';
      } else {
        currentSearchType = 'users';
        searchInput.placeholder = 'Enter GitHub username...';
        toggleSearchTypeBtn.textContent = 'Search Users';
      }
    });
  
    // Function to search GitHub users by name
    function searchUsers(username) {
      const url = `https://api.github.com/search/users?q=${username}`;
      fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json"
        }
      })
        .then(response => response.json())
        .then(data => displayUsers(data.items))
        .catch(error => console.error('Error searching users:', error));
    }
  
    // Function to display search results for GitHub users
    function displayUsers(users) {
      resultsContainer.innerHTML = ''; // Clear previous results
  
      users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList.add('user-card');
        
        const username = document.createElement('h3');
        username.textContent = user.login;
        userCard.appendChild(username);
        
        const avatar = document.createElement('img');
        avatar.src = user.avatar_url;
        avatar.alt = `${user.login}'s avatar`;
        userCard.appendChild(avatar);
  
        const profileLink = document.createElement('a');
        profileLink.href = user.html_url;
        profileLink.textContent = 'Profile';
        profileLink.target = '_blank';
        userCard.appendChild(profileLink);
  
        userCard.addEventListener('click', () => {
          fetchUserRepos(user.login);
        });
  
        resultsContainer.appendChild(userCard);
      });
    }
  
    // Function to fetch and display repositories for a specific user
    function fetchUserRepos(username) {
      const url = `https://api.github.com/users/${username}/repos`;
      fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json"
        }
      })
        .then(response => response.json())
        .then(repos => displayRepos(username, repos))
        .catch(error => console.error('Error fetching repos:', error));
    }
  
    // Function to display repositories for a specific user
    function displayRepos(username, repos) {
      resultsContainer.innerHTML = ''; // Clear previous results
  
      const userHeading = document.createElement('h2');
      userHeading.textContent = `${username}'s Repositories`;
      resultsContainer.appendChild(userHeading);
  
      const repoList = document.createElement('ul');
      repos.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.textContent = repo.full_name;
        repoList.appendChild(repoItem);
      });
      resultsContainer.appendChild(repoList);
    }
  
    // Function to search GitHub repositories by keyword (bonus, not implemented)
    function searchRepos(repoName) {
      const url = `https://api.github.com/search/repositories?q=${repoName}`;
      fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json"
        }
      })
        .then(response => response.json())
        .then(data => console.log(data)) // Display repos based on search
        .catch(error => console.error('Error searching repos:', error));
    }
  });
  
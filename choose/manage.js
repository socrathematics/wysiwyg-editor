function requestUserRepos(username){

    // create new XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // GitHub endpoint, dynamically passing in specified username
    const url = `https://api.github.com/users/${username}/repos`;
    xhr.open('GET', url, true);
    // When request is received
    // Process it here
    xhr.onload = function() {

        // Parse API data into JSON
        const data = JSON.parse(this.response);

        // Log the response
        console.log(data);

        // Loop over each object in data array
        for (let i in data) {

            // Log the repo name
            console.log('Repo:', data[i].name);

            // Log the repo description
            console.log('Description:', data[i].description);

            // Log the repo url
            console.log('URL:', data[i].html_url);

            // Add a separator between each repo
            console.log('=========================')

        }

    }

    // Send the request to the server
    xhr.send();
}

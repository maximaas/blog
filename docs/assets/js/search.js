(function() {
  function displaySearchResults(results, store) {
    var searchResults = document.getElementById('search-results');

    if (results.length) { // Are there any results?
      var appendString = '';

      for (var i = 0; i < results.length; i++) {  // Iterate over the results
        var item = store[results[i].ref];
        //appendString += '<li><a href="' + item.url + '"><h3>' + item.title + '</h3></a>';
        //appendString += '<p>' + item.content.substring(0, 150) + '...</p></li>';
        
        
				appendString += '      <div class=\"blog-short\">';
				appendString += '          <h2><a href=\"/blog' + item.url + '\">' + item.title + '</a></h2>';
				appendString += '				<div>';
				appendString += '					<small>';
				appendString += '						<i class=\"fa fa-calendar\"></i>';
				appendString += '						<time>';
				appendString += 							item.date;
				appendString += '						</time>';
				appendString += '					</small>';
				appendString += '				</div>';
				appendString += '      </div>';
        
        
        
      }

      searchResults.innerHTML = appendString;
    } else {
      searchResults.innerHTML = 'No results found';
    }
  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

	var results = "";

	var tag = getQueryVariable('tag');
	var category = getQueryVariable('category');
	if (category) {
    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    var idx = lunr(function () {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('author');
      this.field('category');
      this.field('date');
      
    	for (var key in window.store) { // Add the data to lunr
	      this.add({
	        'id': key,
	        'title': window.store[key].title,
	        'author': window.store[key].author,
	        'category': window.store[key].category,
	        'date': window.store[key].date
      	});
      }
    });
		
    results = idx.search(category); // Get lunr to perform a search
    displaySearchResults(results, window.store); // We'll write this in the next section
	}
	else if (tag)  {
    var idx = lunr(function () {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('author');
      this.field('tag');
      this.field('date');
      
    	for (var key in window.store) { // Add the data to lunr
	      this.add({
	        'id': key,
	        'title': window.store[key].title,
	        'author': window.store[key].author,
	        'tag': window.store[key].tags,
	        'date': window.store[key].date
      	});
      }
    });
		
    results = idx.search(tag); // Get lunr to perform a search
    displaySearchResults(results, window.store); // We'll write this in the next section
	}
  else {
  
	  var searchTerm = getQueryVariable('query');
	  if (searchTerm) {
	    document.getElementById('search-box').setAttribute("value", searchTerm);

	    // Initalize lunr with the fields it will be searching on. I've given title
	    // a boost of 10 to indicate matches on this field are more important.
	    var idx = lunr(function () {
	      this.field('id');
	      this.field('title', { boost: 10 });
	      this.field('author');
	      this.field('category');
	      this.field('content');
	      this.field('date');
	      
	    	for (var key in window.store) { // Add the data to lunr
		      this.add({
		        'id': key,
		        'title': window.store[key].title,
		        'author': window.store[key].author,
		        'category': window.store[key].category,
		        'content': window.store[key].content,
		        'date': window.store[key].date
	      	});
	      }
	    });
			
	    results = idx.search(searchTerm); // Get lunr to perform a search
	    displaySearchResults(results, window.store); // We'll write this in the next section
	  }
  
	}
  
})();
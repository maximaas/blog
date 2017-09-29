  function getComments(issue_id, issues_url, target) {
		if (!issue_id) return false;
		
    var comments = document.getElementsByClassName(target)[0];
    var a = document.createElement('a');
    a.href = issues_url;
    var api = 'https://api.github.com/repos' + a.pathname;
    var issue_url = issues_url +  '/' + issue_id;
    var comments_url = api + '/' + issue_id + '/comments';
    
    fetch(comments_url, {
      headers: new Headers({
        'Accept': 'application/vnd.github.v3.html+json',
        'Content-Type': 'application/json'
      }),
      method: 'GET'
    }).then((res) => {
      if (res.status == 200) return res.json();
      let error = new Error('HTTP Exception[GET]');
      error.status = res.status;
      error.statusText = res.statusText;
      error.url = res.url;
      throw error;
    }).then((json) => {
        comments.insertAdjacentHTML('afterbegin', `<div class=\"comments-header\"><h3>评论和留言 <span class=\"pull-right\" style=\"font-size: 14px;font-weight: 400;\"><a href="${issue_url}" target="_blank">点此留言...</a></span></h3></div>`);
        
        var count = 0;
        
        for (let comment of json) {
          let date = new Date(comment.created_at);
          let c = '<div class="comment">' +
          		'<div style="border-bottom: 1px dotted #ddd;">' +
              `<img src="${comment.user.avatar_url}" width="24px"> ` +
              `<a href="${comment.user.html_url}">${comment.user.login}</a>` +
              ' posted at ' +
              `<time>${date.toUTCString()}</time>` +
              '</div>' +
              comment.body_html +
              '</div>';
          comments.insertAdjacentHTML('beforeend', c);
          
          count++;
        }
				
				if (count == 0) {
					comments.insertAdjacentHTML('beforeend', '<div class="comment">暂无评论</div>');
				}

    }).catch((err) => {
      comments.insertAdjacentHTML('afterbegin', `<div class=\"comments-header\"><h3>评论和留言 <span class=\"pull-right\" style=\"font-size: 14px;font-weight: 400;\">(Comments are not open for this post yet)</span></h3></div>`);
    });
  }
  
  function getCommentsCount(issue_id, target) {
		if (!issue_id) return false;
		
    var comments = document.getElementsByClassName(target)[0];
    var a = document.createElement('a');
    a.href = issues_url;
    var api = 'https://api.github.com/repos' + a.pathname;
    var issue_url = issues_url +  '/' + issue_id;

    fetch(issue_url, {
      headers: new Headers({
        'Accept': 'application/vnd.github.v3.html+json',
        'Content-Type': 'application/json'
      }),
      method: 'GET'
    }).then((res) => {
      if (res.status == 200) return res.json();
      let error = new Error('HTTP Exception[GET]');
      error.status = res.status;
      error.statusText = res.statusText;
      error.url = res.url;
      throw error;
    }).then((json) => {
    	alert(json.comments);
      comments.insertAdjacentHTML('afterbegin', '${json.comments}');
    }).catch((err) => {
      comments.insertAdjacentHTML('afterbegin', `0`);
    });
  }

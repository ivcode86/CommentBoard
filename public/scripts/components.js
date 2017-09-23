class Comment extends React.Component{
	render(){
	return (
	<div className =  "comment">
	<img src={ this.props.avatarUrl } alt={`${this.props.author} fotos`} />
	 <p className = "comment-header">{this.props.author}</p>
	 <p className = "comment-body">{this.props.body}</p>
	 <div className="comment-footer">
	   <a href="#" onClick={this._handleDelete.bind(this)} className="comment-footer-delete">
	     Delete comment
	   </a>
	 </div>
	</div>
	);
	}

	_handleDelete(event){
		event.preventDefault();
		if (confirm('Are you Sure?')){
			this.props.OnDelete(this.props.id);
		}
	}
}








class CommentBox extends React.Component {
	constructor() {
		super();

		this.state = {
			showComments: false,
			comments: []
		};
	}

componentWillMount() {
	this._fetchComments();
 }

 _fetchComments() {
 	jQuery.ajax({
 		method: 'GET',
 		url: '/api/comments',
 		dataType: 'json',
 		success: (comments) => {
 			this.setState({
 				comments
 			})
 		}
 	});
 }
 
_getComments(){
	return this.state.comments.map((comment)=>{
    return(
		<Comment author={comment.author} body={comment.body} key={comment.id} avatarUrl={comment.avatarUrl}  id = { comment.id }
		OnDelete={this._deleteComment.bind(this)}/>
);
});
}

_getCommentTitle(commentCount){
	if (commentCount===0){
		return 'No Comment';
	}else if (commentCount ===1 ){
		return '1 comment'
	}else{
		return `${commentCount} comments`;
	}
}

_handleClick() {
	this.setState({
		showComments: !this.state.showComments
	});
}


_addComment(commentAuthor, commentBody) {
	const comment = {
		id: this.state.comments.length + 1,
		author: commentAuthor,
		body: commentBody,
		avatarUrl: 'images/avatar-default.png'
	};
	this.setState({
		comments: this.state.comments.concat([comment])
	});
}

_deleteComment(commentID) {
	//confirm('ID is '+commentID)
	const comments = this.state.comments.filter(
			comment => comment.id !== commentID);
	this.setState({
		comments
	});
}

	render(){
		const comments = this._getComments();
		let commentNodes,buttonText = 'Show Comments';
		if (this.state.showComments){
			buttonText = 'Hide comments';
			commentNodes = <div className="comment-list">{comments}</div>;
		}
		return (
			<div className="comment-box">
			<CommentForm addComment={this._addComment.bind(this)} />
			<h3>Comments</h3>
			<button onClick ={this._handleClick.bind(this)}>{buttonText}</button>
			<h4 className="comment-count">{this._getCommentTitle(comments.length)}</h4>
			<div className = "comment-list">
            {commentNodes}
			</div>
			</div>
		);
	}
}









class CommentForm extends React.Component {

	constructor() {
		super();

		this.state = {
			characters: 0
		};
	}

	render(){
		return (
			<form className="comment-form" onSubmit={this._handleSumbit.bind(this)}>
			<label>Join the discussion</label>
			<div className="comment-form-fields">
			<input placeholder="Name" ref={(input)=>this._author = input}/>
			<textarea placeholder = "Comment:" ref={(textarea)=>this._body=textarea}></textarea>
            </div>
            <div className="comment-form-actions">
			<button type="submit">Post Comment</button>
			</div>
			</form>
		);
	}

	_handleSumbit(event) {
		event.preventDefault();

		let author = this._author;
		let body = this._body;

		this.props.addComment(author.value, body.value);
	}

}




let target = document.getElementById('comment-app');

ReactDOM.render( <CommentBox/>, target);

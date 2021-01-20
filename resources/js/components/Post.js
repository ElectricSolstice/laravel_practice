import React, {Component} from 'react';
import ReactDom from 'react-dom';

import InfiniteScroll from './InfiniteScroll.js';
import LoginData from './LoginData.js';
import * as Helpers from '../helpers.js'
import * as Message from './Message.js'
import * as MessageUI from './MessageUI.js'

function postLink (postId) {
    return "/post/"+String(Number(postId));
}

export default class Post extends Component {
    /*
     * props expected:
     *
     * userName: user that created the post
     * title:
     * content: text of the post
     * time: time the comment was created
     * id: id of post
     *
     */
    constructor(props) {
        super(props);
        Message.construct(this);
    }

    render() {
        if (this.state.deleted) {
            return null;
        }
        return (
            <div className="post" id={"post-" + String(this.props.id)}>
                <a href={postLink(this.props.id)} className="title">{this.props.title}</a>
                <span className="name">{this.props.userName}</span>
                <span className="time">{this.props.time}</span>
                <p className="text">{this.props.content}</p>
                {this.state.messageActions}
            </div>
        );
    }

    deleteMessage() {
        Message.deleteMessage("/session/post/"+this.props.id+"/delete", this);
    }

    /* For use with InfiniteScroll*/
    static lazyCreate (data, onDeletion) {
        if (data.user_name  && data.title && data.post_id) {
            var postTime = data.created_at;
            if (!postTime) {
                postTime = "unknown";
            }
            return (<Post login={new LoginData()} key={data.post_id} id={data.post_id} title={data.title}
                userName={data.user_name} content={data.content} onDelete={onDeletion} time={postTime}/>)
        } else {
            return null
        }
    }

    /* For use with InfiniteScroll*/
    static eagerCreate (post, onDeletion) {
        var postTitle = post.getAttribute("data-title");
        var postUser = post.getAttribute("data-username");
        var postId = post.getAttribute("data-post-id");
        if (postTitle && postUser && postId) {
            var postTime = post.getAttribute("data-created-at");
            if (!postTime) {
                postTime = "unknown";
            }
            var postContent = post.getAttribute("data-content");
            return (<Post login={new LoginData()} key={postId} id={postId} userName={postUser} title={postTitle}
                content={postContent} onDelete={onDeletion} time={postTime} />);
        } else {
            return null;
        }
    }
}

export class PostListUI extends Component {
    /* For use with InfiniteScroll*/

    /*
     * props expected:
     * login: LoginData singleton to keep track of poster
     * onPostCreated: a callback that can create a new post from json data
     */
    constructor(props) {
        super(props);
        MessageUI.construct(this);
        this.onPostTitleChange = this.onPostTitleChange.bind(this);
        this.onPostContentChange = this.onPostContentChange.bind(this);
        this.createPost = this.createPost.bind(this);
        this.state['postTitle'] = "";
        this.state['postContent'] = "";
    }

    render () {
        if (this.state.loggedIn && this.props.login && this.props.login.userId) {
            var postForm = this.createPostForm();
            return (
                <div>
                    <button onClick={this.toggleMessageForm}>Post</button>
                    {postForm}
                </div>
            );
        } else {
            return null;
        }
    }

    onPostTitleChange(ev) {
        this.setState({
            postTitle: ev.target.value
        });
        ev.preventDefault();
    }

    onPostContentChange(ev) {
        this.setState({
            postContent: ev.target.value,
        });
        ev.preventDefault();
    }

    refreshMessageForm() {
        this.setState({
            postTitle: "",
            postContent: ""
        });
    }

    createPostForm() {
        if (this.state.formOpen) {
            var newForm = <form className={MessageUI.messageFormClasses()}>
                <label>Title</label>
                <input value={this.state.postTitle} onChange={this.onPostTitleChange} />
                <label>Post</label>
                <textarea value={this.state.postContent} onChange={this.onPostContentChange}></textarea>
                <button onClick={this.createPost}>Create</button>
                </form>;
            return newForm;
        } else {
            return null;
        }
    }

    createPost(ev) {
        ev.preventDefault();
        var callback = null;
        if (this.props.onPostCreated) {
            callback = this.props.onPostCreated
        }
        MessageUI.createMessage(this, 'forum', 'posts', 
        function() {
            return {
                title: this.state.postTitle,
                content: this.state.postContent,
                user_id: this.props.login.userId
            };
        }.bind(this), callback);
    }

}

function createPostUi (container) {
    let createPost = new Helpers.PubSub();
    ReactDom.render(<PostListUI login={new LoginData()} onPostCreated={createPost.publish} />, container);
    let observePostCreation = createPost.subscribe.bind(createPost);
    return observePostCreation;

}

function createPostListScroll (container, onCreation) {
    ReactDom.render(<InfiniteScroll dataKey="posts" containerName="forum" elementName="post"
        eagerLoad={Post.eagerCreate} lazyLoad={Post.lazyCreate} onCreate={onCreation} />, container);
}

Message.mountMessages('posts', createPostUi, createPostListScroll);

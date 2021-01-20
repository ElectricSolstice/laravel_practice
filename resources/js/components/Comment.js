import React, {Component} from 'react';
import ReactDom from 'react-dom';

import InfiniteScroll from './InfiniteScroll.js';
import LoginData from './LoginData.js';
import * as Helpers from '../helpers.js'
import * as Message from './Message.js'
import * as MessageUI from './MessageUI.js'

export default class Comment extends Component {
    /*
     * props expected:
     *
     * userName: user that created the comment
     * content: text of the comment
     * time: time the comment was created
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
            <div className="comment" id={"comment-" + String(this.props.id)}>
                <span className="name">{this.props.userName}</span>
                <span className="time">{this.props.time}</span>
                <p className="text">{this.props.content}</p>
                {this.state.messageActions}
            </div>
        );
    }

    deleteMessage() {
        Message.deleteMessage("/session/comment/"+this.props.id+"/delete", this);
    }

    static lazyCreate (data, onDeletion) {
        if (data.user_name  && data.content && data.comment_id) {
            var commentTime = data.created_at;
            if (!commentTime) {
                commentTime = "unknown";
            }
            return (<Comment login={new LoginData()} key={data.comment_id} id={data.comment_id} userName={data.user_name}
                content={data.content} onDelete={onDeletion} time={commentTime} />)
        } else {
            return null
        }
    }

    static eagerCreate (comment, onDeletion) {
        var commentUser = comment.getAttribute("data-username");
        var commentId = comment.getAttribute("data-comment-id");
        if (commentUser && commentId) {
            var commentTime = comment.getAttribute("data-created-at");
            if (!commentTime) {
                commentTime = "unknown";
            }
            var commentContent = comment.getAttribute("data-content");
            return (<Comment login={new LoginData()} key={commentId} id={commentId} userName={commentUser}
                content={commentContent} onDelete={onDeletion} time={commentTime} />);
        } else {
            return null;
        }
    }

}

export class CommentListUI extends Component {
    /* For use with InfiniteScroll*/
    constructor(props) {
        super(props);
        MessageUI.construct(this);
        this.onCommentContentChange = this.onCommentContentChange.bind(this);
        this.createComment = this.createComment.bind(this);
        this.state['content'] = "";
    }

    render() {
        if (this.state.loggedIn && this.props.login && this.props.login.userId) {
            var commentForm = this.createCommentForm();
            return (
                <div>
                    <button onClick={this.toggleMessageForm}>Comment</button>
                    {commentForm}
                </div>
            );
        } else {
            return null;
        }
    }

    refreshMessageForm() {
        this.setState({
            content: ""
        });
    }

    onCommentContentChange(ev) {
        this.setState({
            content: ev.target.value
        });
    }

    createCommentForm() {
        if (this.state.formOpen) {
            var newForm = <form className={MessageUI.messageFormClasses()}>
                <label>Comment</label>
                <textarea value={this.state.content} onChange={this.onCommentContentChange}></textarea>
                <button onClick={this.createComment}>Create</button>
                </form>;
            return newForm;
        } else {
            return null;
        }
    }

    createComment(ev) {
        ev.preventDefault();
        var callback = null;
        if (this.props.onCommentCreated) {
            callback = this.props.onCommentCreated
        }
        MessageUI.createMessage(this, 'post', 'comments', 
        function() {
            return {
                content: this.state.content,
                user_id: this.props.login.userId
            };
        }.bind(this), callback);
    }
}

function createCommentUi (container) {
    let createComment = new Helpers.PubSub();
    ReactDom.render(<CommentListUI login={new LoginData()} onCommentCreated={createComment.publish} />, container);
    let observeCommentCreation = createComment.subscribe.bind(createComment);
    return observeCommentCreation;

}

function createCommentListScroll (container, onCreation) {
    ReactDom.render(<InfiniteScroll dataKey="comments" containerName="post" elementName="comment"
        eagerLoad={Comment.eagerCreate} lazyLoad={Comment.lazyCreate} onCreate={onCreation} />, container);
}

Message.mountMessages('comments', createCommentUi, createCommentListScroll);

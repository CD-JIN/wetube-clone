const { async } = require("regenerator-runtime");

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const commentDeleteBtns = document.querySelectorAll(".commentDeleteBtn");

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    const div = document.createElement("div");
    newComment.dataset.id = id;
    newComment.classList.add("video__comment");
    const icon = document.createElement("i");
    const icon2 = document.createElement("i");
    icon.className = "fas fa-comment";
    icon2.className = "far fa-trash-alt";
    const span = document.createElement("span");
    const span2 = document.createElement("span");
    span.innerText = `  ${text}`;
    span2.classList.add("commentDeleteBtns");
    div.appendChild(icon);
    div.appendChild(span);
    span2.appendChild(icon2);
    newComment.appendChild(div);
    newComment.appendChild(span2);
    videoComments.prepend(newComment);
    span2.addEventListener("click", handleDeleteComment);
}

const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if (text === "") {
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({text}),
    });
    textarea.value = "";
    if (response.status === 201) {
        const {newCommentId} = await response.json();
        addComment(text, newCommentId);
    }
}

if (form) {
    form.addEventListener("submit", handleSubmit);
}

const handleDeleteComment = async (event) => {
    const commentList = event.target.parentNode.parentNode;
    const commentId = commentList.dataset.id;
    const videoId = videoContainer.dataset.id;
    console.log(commentList);
    const response = await fetch(`/api/videos/${videoId}/comments/${commentId}/delete`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({commentId, videoId}),
    });
    if (response.status === 200) {
        event.target.parentNode.parentNode.remove();
    }
} 

if (commentDeleteBtns) {
    commentDeleteBtns.forEach((btn) => btn.addEventListener("click", handleDeleteComment));
}
const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");
const deleteBtn = document.querySelectorAll(".video__comment__delete");
const videoComments = document.querySelector(".video__comments ul");

const addComment = (text, id) => {
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id;
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const deleteSpan = document.createElement("span");
  deleteSpan.className = "video__comment__delete";
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fas fa-trash";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(deleteSpan);
  deleteSpan.appendChild(deleteIcon);
  videoComments.prepend(newComment);
}

const handleSubmit = async (event) => {
  event.preventDefault();
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if(text.trim() == "") return;
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if(response.status == 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
}

const handleCommentDeleteClick = async (event) => {
  event.preventDefault();
  if (event.target.classList.contains("fa-trash")) {
    const element = event.target.closest(".video__comment");
    const id = element.dataset.id;
    if(!element) return;
    
    const response = await fetch(`/api/comment`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    if(response.status == 201) {
      videoComments.removeChild(element);
    }
  }
}

form.addEventListener("submit", handleSubmit);
videoComments.addEventListener("click", handleCommentDeleteClick);
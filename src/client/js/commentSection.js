const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");
const videoComments = document.querySelector(".video__comments");
const deleteBtn = document.querySelectorAll(".video__comment__delete");
const editBtn = document.querySelectorAll(".video__comment__edit");

let textareaOpened = false;

const addComment = (text, id, name) => {
  const newComment = document.createElement("div");
  newComment.className = "video__comment";
  newComment.dataset.id = id;

  const contentDiv = document.createElement("div");
  contentDiv.className = "video__comment__content";

  const username = document.createElement("div");
  username.className = "comment-username";
  username.innerText = name;

  const textDiv = document.createElement("div");
  textDiv.className = "comment-box"
  textDiv.innerText = text;

  const iconsDiv = document.createElement("div");
  iconsDiv.className = "video__comment__icons";

  const deleteSpan = document.createElement("span");
  deleteSpan.className = "video__comment__delete";
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fas fa-trash";

  const editSpan = document.createElement("span");
  editSpan.className = "video__comment__edit";
  const editIcon = document.createElement("i");
  editIcon.className = "fas fa-pen"

  const updateDiv = document.createElement("div");
  updateDiv.className = "video__comment__update";

  contentDiv.appendChild(username);
  contentDiv.appendChild(textDiv);
  contentDiv.appendChild(iconsDiv);
  iconsDiv.appendChild(deleteSpan);
  iconsDiv.appendChild(editSpan);
  deleteSpan.appendChild(deleteIcon);
  editSpan.appendChild(editIcon);
  newComment.appendChild(contentDiv);
  videoComments.prepend(newComment);
  contentDiv.after(updateDiv);

  deleteSpan.addEventListener("click", handleCommentDeleteClick);
  editSpan.addEventListener("click", handleCommentEditClick);
}

const handleCommentSubmit = async (event) => {
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
    const { newCommentId, username } = await response.json();
    addComment(text, newCommentId, username);
  }
}

const handleCommentDeleteClick = async (event) => {
  event.preventDefault();
  if (event.target.classList.contains("fa-trash")) {
    const element = event.target.closest(".video__comment");
    const id = element.dataset.id;
    if(!element) return;
    
    const userResponse = confirm("댓글을 삭제하시겠습니까?")
    if (!userResponse) return;

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

const handleCommentUpdateClick = async (event) => {
  event.preventDefault();
  textareaOpened = !textareaOpened;
  if (event.target.tagName == "BUTTON") {
    const parent = event.target.closest(".video__comment");
    const element = parent.querySelector(".video__comment__content");
    const textareaValue = element.querySelector("textarea").value;
    const id = parent.dataset.id;
    if(!parent) return;
    
    const response = await fetch(`/api/comment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, textareaValue }),
    });
    if(response.status == 201) {
      const textarea = element.querySelector("textarea");
      const updateDiv = parent.querySelector(".video__comment__update");
      const icons =  element.querySelector(".video__comment__icons");
      const text = document.createElement("div");
      text.className = "comment-box";
      text.innerText = textarea.value;
      
      icons.before(text);
      element.removeChild(textarea);
      updateDiv.removeChild(updateDiv.querySelector("button"));
    }
  }
}

const handleCommentEditClick = (event) => {
  event.preventDefault();
  const parent = event.target.closest(".video__comment");
  const content = parent.querySelector(".video__comment__content");
  const icons =  content.querySelector(".video__comment__icons");
  textareaOpened = !textareaOpened;
  if (textareaOpened) {
    const commentText = content.querySelector(".comment-box");
    const editTextarea = document.createElement("textarea");
    editTextarea.cols = "20";
    editTextarea.rows = "5";
    editTextarea.value = commentText.innerText;

    const updateDiv = parent.querySelector(".video__comment__update");
    const updateBtn = document.createElement("button");
    updateBtn.innerText = "Update";

    content.removeChild(commentText);
    icons.before(editTextarea);
    content.after(updateDiv);
    updateDiv.appendChild(updateBtn);

    updateBtn.addEventListener("click", handleCommentUpdateClick);
  }
  else {
    const updateDiv = parent.querySelector(".video__comment__update");
    const textarea = content.querySelector("textarea");
    const commentBox = document.createElement("div");
    commentBox.className = "comment-box";
    commentBox.innerText = textarea.value;
    
    icons.before(commentBox);
    content.removeChild(textarea);
    updateDiv.removeChild(updateDiv.querySelector("button"));
  }
}

form.addEventListener("submit", handleCommentSubmit);
deleteBtn.forEach(comment => {
  comment.addEventListener("click", handleCommentDeleteClick);
})
editBtn.forEach(comment => {
  comment.addEventListener("click", handleCommentEditClick);
})
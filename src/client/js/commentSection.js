const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");
const videoComments = document.querySelector(".video__comments");
const deleteBtn = document.querySelectorAll(".video__comment__delete");
const editBtn = document.querySelectorAll(".video__comment__edit");

let textareaOpened = false;

const addComment = (text, id) => {
  const newComment = document.createElement("div");
  newComment.className = "video__comment";
  newComment.dataset.id = id;

  const contentDiv = document.createElement("div");
  contentDiv.className = "video__comment__content";
  
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";

  const textDiv = document.createElement("div");
  textDiv.innerText = ` ${text}`;

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

  contentDiv.appendChild(icon);
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
    const id = parent.dataset.id;
    if(!parent) return;
    
    const response = await fetch(`/api/comment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    if(response.status == 201) {
      const editForm = parent.querySelector(".video__comment__edit-form");
      const updateDiv = parent.querySelector(".video__comment__update");
      const editTextarea = document.createElement("div");
      const icons =  element.querySelector(".video__comment__icons");
      editTextarea.innerText = `${editForm.querySelector("textarea").value}`;
      
      icons.before(editTextarea);
      element.removeChild(editForm);
      updateDiv.removeChild(updateDiv.querySelector("button"));
      console.log(201);
    }
  }
}

const handleCommentEditClick = (event) => {
  event.preventDefault();
  const parent = event.target.closest(".video__comment");
  const element = parent.querySelector(".video__comment__content");
  const icons =  element.querySelector(".video__comment__icons");
  textareaOpened = !textareaOpened;
  if (textareaOpened) {
    const commentText = element.querySelector("div");
    const editForm = document.createElement("form");
    const editTextarea = document.createElement("textarea");
    editForm.className = "video__comment__edit-form";
    editTextarea.cols = "20";
    editTextarea.rows = "5";
    editTextarea.value = commentText.textContent;

    const updateDiv = parent.querySelector(".video__comment__update");
    const updateBtn = document.createElement("button");
    updateBtn.innerText = "Update";

    element.removeChild(commentText);
    editForm.appendChild(editTextarea);
    icons.before(editForm);
    element.after(updateDiv);
    updateDiv.appendChild(updateBtn);

    updateBtn.addEventListener("click", handleCommentUpdateClick);
  }
  else {
    const editForm = parent.querySelector(".video__comment__edit-form");
    const updateDiv = parent.querySelector(".video__comment__update");
    const textDiv = document.createElement("div");
    textDiv.innerText = `${editForm.querySelector("textarea").value}`;
    
    icons.before(textDiv);
    element.removeChild(editForm);
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
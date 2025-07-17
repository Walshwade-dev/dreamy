// comments.js

export function loadComments() {
    const form = document.getElementById("commentForm");
    const commentsList = document.getElementById("commentsContainer");
    const fanCommentsSection = document.getElementById("fanComments");

    if (!form || !commentsList || !fanCommentsSection) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = form.name.value.trim();
        const message = form.comment.value.trim();

        if (!name || !message) return;

        const comment = {
            id: `c-${Date.now()}`, // unique id
            name,
            message,
            timestamp: Date.now()
        };

        renderComment(comment);
        form.reset();
        fanCommentsSection.classList.remove("hidden");
    });

    function renderComment(comment) {
        const commentCard = document.createElement("div");
        commentCard.className = "comment-card new-comment";

        setTimeout(() => commentCard.classList.remove("new-comment"), 500);


        // Avatar
        const avatar = document.createElement("div");
        avatar.className = "fan-avatar";
        avatar.innerHTML = `<i class="fa-solid fa-user"></i>`;

        // Info
        const fanName = document.createElement("strong");
        fanName.textContent = comment.name;

        const timestamp = document.createElement("small");
        timestamp.textContent = timeAgo(comment.timestamp);

        const header = document.createElement("div");
        header.className = "comment-header";
        header.appendChild(avatar);

        const info = document.createElement("div");
        info.className = "comment-info";
        info.appendChild(fanName);
        info.appendChild(timestamp);
        header.appendChild(info);

        // Message
        const messageEl = document.createElement("p");
        messageEl.textContent = comment.message;

        // Like button
        const likeBtn = document.createElement("button");
        likeBtn.className = "comment-like-btn";
        likeBtn.innerHTML = `<i class="fa-solid fa-heart"></i> <span class="like-count">0</span>`;
        likeBtn.dataset.commentId = comment.id;

        // Load stored likes
        const storedLikes = localStorage.getItem(`comment-like-${comment.id}`);
        if (storedLikes) {
            likeBtn.classList.add("liked");
            likeBtn.querySelector(".like-count").textContent = storedLikes;
            likeBtn.querySelector("i").style.color = "red";
        }

        // Like toggle
        likeBtn.addEventListener("click", () => {
            const heartIcon = likeBtn.querySelector("i");
            const countSpan = likeBtn.querySelector(".like-count");

            let count = parseInt(countSpan.textContent) || 0;
            const liked = likeBtn.classList.toggle("liked");

            if (liked) {
                count++;
                heartIcon.style.color = "red";
            } else {
                count = Math.max(0, count - 1);
                heartIcon.style.color = ""; // Reset to default/inherit
            }

            countSpan.textContent = count;
            if (count > 0) {
                localStorage.setItem(`comment-like-${comment.id}`, count);
            } else {
                localStorage.removeItem(`comment-like-${comment.id}`);
            }
        });

        const body = document.createElement("div");
        body.className = "comment-body";
        body.appendChild(messageEl);
        body.appendChild(likeBtn);

        commentCard.appendChild(header);
        commentCard.appendChild(body);
        commentsList.prepend(commentCard);
    }

    function timeAgo(timestamp) {
        const now = Date.now();
        const seconds = Math.floor((now - timestamp) / 1000);

        if (seconds < 60) return "Posted: just now";
        if (seconds < 3600) return `Posted: ${Math.floor(seconds / 60)} min ago`;
        if (seconds < 86400) return `Posted: ${Math.floor(seconds / 3600)} hr ago`;

        const date = new Date(timestamp);
        return `Posted: ${date.toLocaleString()}`;
    }
}

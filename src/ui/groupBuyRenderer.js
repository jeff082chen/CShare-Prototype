import { groupBuyService } from "../services/groupBuyService.js";

export const groupBuyRenderer = {
    
    switchTab(activeTabId) {
        const createContent = document.getElementById('content-create');
        const findContent = document.getElementById('content-find');
        const joinedContent = document.getElementById('content-joined');
        const detailContent = document.getElementById('content-detail');
        const tabs = document.getElementById('mainTabs');
        
        const createBtn = document.getElementById('tab-btn-create');
        const findBtn = document.getElementById('tab-btn-find');
        const joinedBtn = document.getElementById('tab-btn-joined');

        createContent.classList.remove('active');
        findContent.classList.remove('active');
        joinedContent.classList.remove('active');
        detailContent.classList.remove('active');
        tabs.style.display = 'flex'; 

        createBtn.classList.remove('active');
        findBtn.classList.remove('active');
        joinedBtn.classList.remove('active');

        if (activeTabId === 'create') {
            createContent.classList.add('active');
            createBtn.classList.add('active');
        } else if (activeTabId === 'find') {
            findContent.classList.add('active');
            findBtn.classList.add('active');
        } else if (activeTabId === 'joined') {
            joinedContent.classList.add('active');
            joinedBtn.classList.add('active');
        } else if (activeTabId === 'detail') {
            detailContent.classList.add('active');
            tabs.style.display = 'none'; 
        }
    },

    renderList(items, containerElement, currentUserId, onCardClick) {
        containerElement.innerHTML = ""; 

        if (!items || items.length === 0) {
            containerElement.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666; grid-column: 1/-1;">
                    <h3>Nothing here yet! 🦗</h3>
                    <p>Check back later.</p>
                </div>`;
            return;
        }

        items.forEach(item => {
            const isWholesale = item.isWholesale;
            const currentCount = item.participantIds ? item.participantIds.length : (item.currentParticipants || 0);
            const displayOwner = item.ownerName || "Unknown User";

            const lastReadTime = parseInt(localStorage.getItem(`lastRead_${item.id}`)) || 0;
            
            let unreadCount = 0;
            if (item.comments && item.comments.length > 0) {
                unreadCount = item.comments.filter(c => c.createdAt > lastReadTime).length;
            }

            let notificationHtml = '';
            if (unreadCount > 0) {
                notificationHtml = `<div class="notification-badge">${unreadCount}</div>`;
            }

            let badgeHtml = isWholesale 
                ? `<span style="background-color: #0d47a1; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75em;">Wholesale</span>`
                : `<span style="background-color: #2e7d32; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75em;">Sharing</span>`;

            const cardHTML = `
                <div class="item-card" data-id="${item.id}">
                    ${notificationHtml}
                    <div class="item-info">
                        <div style="display:flex; justify-content:space-between; align-items:start;">
                            <div style="margin-bottom: 8px;">${badgeHtml}</div>
                            <div style="font-size: 0.8em; color: #888;">by ${displayOwner}</div>
                        </div>
                        <h3 style="margin: 0 0 5px 0;">${item.itemName}</h3>
                        <p style="color: #666; font-size: 0.9em; margin: 0;">
                            👥 ${currentCount}/${item.maxPeople} Joined
                        </p>
                    </div>
                </div>
            `;
            containerElement.insertAdjacentHTML('beforeend', cardHTML);
        });

        containerElement.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', () => {
                const itemId = card.getAttribute('data-id');
                const clickedItem = items.find(i => i.id === itemId);
                if (clickedItem && onCardClick) {
                    onCardClick(clickedItem); 
                }
            });
        });
    },

    renderDetail(item, currentUserId, onActionComplete, onReplyClick) {
        document.getElementById('detail-title').textContent = item.itemName;
        document.getElementById('detail-owner').textContent = `Posted by: ${item.ownerName || 'Unknown'}`;
        document.getElementById('detail-count').textContent = `${item.participantIds ? item.participantIds.length : (item.currentParticipants || 0)} / ${item.maxPeople}`;
        document.getElementById('detail-description').textContent = item.description || "No description provided.";
        document.getElementById('detail-location').textContent = item.location || "TBD";
        
        let dateString = "TBD";
        if (item.meetupTime) {
            const d = new Date(item.meetupTime);
            dateString = d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
        }
        document.getElementById('detail-datetime').textContent = dateString;

        const headerEl = document.getElementById('detail-header');
        const costEl = document.getElementById('detail-cost');
        
        if (item.isWholesale) {
            headerEl.innerHTML = `<span style="background-color: #0d47a1; color: white; padding: 6px 12px; border-radius: 20px;">Wholesale: ${item.wholesaleProvider}</span>`;
            costEl.innerHTML = `<span style="color: #d32f2f;">$5.00 Fee</span>`;
        } else {
            headerEl.innerHTML = `<span style="background-color: #2e7d32; color: white; padding: 6px 12px; border-radius: 20px;">Sharing Group</span>`;
            costEl.innerHTML = `<span style="color: #2e7d32;">Shared Cost</span>`;
        }

        const actionContainer = document.getElementById('detail-action-container');
        actionContainer.innerHTML = ''; 

        const isOwner = (currentUserId && item.ownerId === currentUserId);
        const hasJoined = (item.participantIds && item.participantIds.includes(currentUserId));
        const isFull = (item.participantIds ? item.participantIds.length : 0) >= item.maxPeople;

        const btn = document.createElement('button');
        btn.style.width = '100%';
        btn.style.padding = '15px';
        btn.style.fontSize = '1.1em';
        btn.style.borderRadius = '8px';
        btn.style.border = 'none';
        btn.style.cursor = 'pointer';

        if (isOwner) {
            btn.textContent = "🗑 Delete My Post";
            btn.style.backgroundColor = "#ffcdd2";
            btn.style.color = "#c62828";
            btn.onclick = async () => { if(confirm("Delete post?")) { await groupBuyService.deleteGroupBuy(item.id); onActionComplete(); } };
        } else if (hasJoined) {
            btn.textContent = "🏃 Leave Group";
            btn.style.backgroundColor = "#fff3e0";
            btn.style.color = "#e65100";
            btn.onclick = async () => { if(confirm("Leave group?")) { await groupBuyService.leaveGroupBuy(item.id, currentUserId); onActionComplete(true); } };
        } else if (isFull) {
            btn.textContent = "⛔ Group Full";
            btn.style.backgroundColor = "#eee";
            btn.style.color = "#888";
            btn.disabled = true;
            btn.style.cursor = "not-allowed";
        } else {
            btn.textContent = item.isWholesale ? "Pay $5 & Join" : "Join Sharing Group";
            btn.style.backgroundColor = "#007bff";
            btn.style.color = "white";
            btn.onclick = async () => { if(currentUserId && confirm("Join?")) { await groupBuyService.joinGroupBuy(item.id, currentUserId); onActionComplete(true); } };
        }
        actionContainer.appendChild(btn);

        // --- COMMENT RENDERING ---
        const commentsList = document.getElementById('comments-list');
        commentsList.innerHTML = '';

        if (item.comments && item.comments.length > 0) {
            // Sort by Date
            const allComments = item.comments.sort((a,b) => a.createdAt - b.createdAt);

            // Separate into Top-Level and Replies
            const topLevel = allComments.filter(c => !c.parentId);
            const replies = allComments.filter(c => c.parentId);

            topLevel.forEach(parent => {
                // Render Parent
                commentsList.insertAdjacentHTML('beforeend', this.createCommentHtml(parent, item, currentUserId, isOwner, false));

                // Render Children (Replies)
                const children = replies.filter(r => r.parentId === parent.cid);
                children.forEach(child => {
                    commentsList.insertAdjacentHTML('beforeend', this.createCommentHtml(child, item, currentUserId, isOwner, true));
                });
            });

            // Add Click Listeners for Reply Buttons
            commentsList.querySelectorAll('.btn-reply-text').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const cid = e.target.getAttribute('data-cid');
                    const author = e.target.getAttribute('data-author');
                    if (onReplyClick) onReplyClick(cid, author);
                });
            });

        } else {
            commentsList.innerHTML = '<p style="color:#999; font-style:italic;">No comments yet.</p>';
        }
    },

    // Helper to generate HTML string for a single comment
    createCommentHtml(comment, item, currentUserId, isOwner, isReply) {
        // Visibility Check
        if (comment.isPrivate) {
            const iAmTheOwner = isOwner;
            const iAmTheCommenter = (comment.userId === currentUserId);
            // If reply, check parent author too? keeping simple for now.
            if (!iAmTheOwner && !iAmTheCommenter) return ''; 
        }

        let tags = '';
        if (comment.isPrivate) tags += `<span class="private-tag">🔒 Private</span>`;
        if (comment.userId === item.ownerId) tags += `<span class="owner-tag">👑 Owner</span>`;

        const indentClass = isReply ? 'reply-indent' : '';
        // Only show reply button on top-level comments to prevent deep nesting UI mess
        const replyButton = !isReply 
            ? `<div><button class="btn-reply-text" data-cid="${comment.cid}" data-author="${comment.userName}">↩ Reply</button></div>` 
            : '';

        return `
            <div class="comment-box ${indentClass}" style="${comment.isPrivate ? 'border-left: 3px solid #666;' : ''}">
                <div class="comment-header">
                    <div><strong>${comment.userName}</strong> ${tags}</div>
                    <div>${new Date(comment.createdAt).toLocaleDateString()}</div>
                </div>
                <div style="color: #333;">${comment.text}</div>
                ${replyButton}
            </div>
        `;
    }
};
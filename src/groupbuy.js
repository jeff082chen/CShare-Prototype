import { groupBuyService } from "./services/groupBuyService.js";
import { groupBuyRenderer } from "./ui/groupBuyRenderer.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { firebaseConfig } from "../env-config.js";

console.log("🚀 GroupBuy V8 Loaded (Replies Enabled)");

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Elements
const wholesaleCheckbox = document.getElementById('gbIsWholesale');
const providerContainer = document.getElementById('gbProviderContainer');
const providerInput = document.getElementById('gbProviderName');
const costDisplay = document.getElementById('gbCostDisplay');
const form = document.getElementById('groupBuyForm');

// Tabs
const tabFind = document.getElementById('tab-btn-find');
const tabCreate = document.getElementById('tab-btn-create');
const tabJoined = document.getElementById('tab-btn-joined');

// Containers
const listContainer = document.getElementById('groupBuyListContainer');
const joinedContainer = document.getElementById('groupBuyJoinedContainer');
const btnBackToList = document.getElementById('btn-back-to-list');

// Comment Elements
const btnPostComment = document.getElementById('btn-post-comment');
const commentInput = document.getElementById('commentInput');
const commentIsPrivate = document.getElementById('commentIsPrivate');
const privateCommentLabel = document.getElementById('privateCommentLabel');
// New Reply Elements
const replyIndicator = document.getElementById('reply-indicator');
const replyTargetText = document.getElementById('reply-target-text');
const btnCancelReply = document.getElementById('btn-cancel-reply');

let currentDetailItem = null;
let lastActiveTab = 'find';
let replyingToId = null; // Track if we are replying to a specific comment ID

// --- NAVIGATION ---
async function loadFindTab() {
    lastActiveTab = 'find';
    groupBuyRenderer.switchTab('find');
    listContainer.innerHTML = '<p style="text-align:center; padding: 20px;">Loading deals...</p>';
    
    const currentUser = auth.currentUser;
    const currentUserId = currentUser ? currentUser.uid : null;
    
    let deals = await groupBuyService.getActiveGroupBuys();
    
    if (currentUserId) {
        deals.sort((a, b) => {
            const aJoined = a.participantIds && a.participantIds.includes(currentUserId);
            const bJoined = b.participantIds && b.participantIds.includes(currentUserId);
            return bJoined - aJoined; 
        });
    }
    
    groupBuyRenderer.renderList(deals, listContainer, currentUserId, (clickedItem) => {
        openDetailView(clickedItem);
    });
}

async function loadJoinedTab() {
    lastActiveTab = 'joined';
    groupBuyRenderer.switchTab('joined');
    joinedContainer.innerHTML = '<p style="text-align:center; padding: 20px;">Loading your groups...</p>';

    const currentUser = auth.currentUser;
    if (!currentUser) {
        joinedContainer.innerHTML = '<p style="text-align:center; padding:20px;">Please log in to see your groups.</p>';
        return;
    }
    const currentUserId = currentUser.uid;

    let deals = await groupBuyService.getActiveGroupBuys();
    const myDeals = deals.filter(item => 
        item.participantIds && item.participantIds.includes(currentUserId)
    );

    groupBuyRenderer.renderList(myDeals, joinedContainer, currentUserId, (clickedItem) => {
        openDetailView(clickedItem);
    });
}

async function openDetailView(item) {
    currentDetailItem = item;
    // Reset reply state when opening new item
    resetReplyState();
    
    const currentUser = auth.currentUser;
    const currentUserId = currentUser ? currentUser.uid : null;
    
    localStorage.setItem(`lastRead_${item.id}`, Date.now().toString());

    if (privateCommentLabel) {
        if (currentUserId && currentUserId === item.ownerId) {
            privateCommentLabel.style.display = 'none';
            commentIsPrivate.checked = false;
        } else {
            privateCommentLabel.style.display = 'flex';
        }
    }

    groupBuyRenderer.switchTab('detail');
    
    // Render Detail + Pass a "Reply Callback" so the renderer can tell us when someone clicks "Reply" on a comment
    groupBuyRenderer.renderDetail(item, currentUserId, 
        // Action Callback
        async (shouldStayOpen) => {
            if (shouldStayOpen) {
                const updatedItem = await groupBuyService.getGroupBuyById(item.id);
                openDetailView(updatedItem);
            } else {
                alert("Done!");
                if (lastActiveTab === 'joined') loadJoinedTab();
                else loadFindTab();
            }
        },
        // Reply Click Callback
        (commentId, authorName) => {
            startReply(commentId, authorName);
        }
    );
}

// --- REPLY LOGIC ---
function startReply(commentId, authorName) {
    replyingToId = commentId;
    replyIndicator.style.display = 'flex';
    replyTargetText.textContent = `Replying to ${authorName}...`;
    commentInput.focus();
    commentInput.placeholder = "Write a reply...";
}

function resetReplyState() {
    replyingToId = null;
    replyIndicator.style.display = 'none';
    commentInput.placeholder = "Ask a question...";
}

if (btnCancelReply) {
    btnCancelReply.addEventListener('click', () => {
        resetReplyState();
    });
}

tabFind.addEventListener('click', () => loadFindTab());
tabJoined.addEventListener('click', () => loadJoinedTab());
tabCreate.addEventListener('click', () => {
    lastActiveTab = 'create';
    groupBuyRenderer.switchTab('create');
});
btnBackToList.addEventListener('click', () => {
    if (lastActiveTab === 'joined') loadJoinedTab();
    else loadFindTab();
});

// --- SUBMIT GROUP BUY ---
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentUser = auth.currentUser;
        if (!currentUser) return alert("Please log in.");

        const niceName = currentUser.displayName || currentUser.email.split('@')[0];
        const isWholesale = wholesaleCheckbox.checked;
        const fee = isWholesale ? 5.00 : 0.00;

        const formData = {
            itemName: document.getElementById('gbItemName').value,
            maxPeople: parseInt(document.getElementById('gbMaxPeople').value),
            description: document.getElementById('gbDescription').value,
            location: document.getElementById('gbLocation').value,
            meetupTime: document.getElementById('gbDateTime').value,
            isWholesale: isWholesale,
            wholesaleProvider: isWholesale ? providerInput.value : null,
            joiningFee: fee,
            ownerId: currentUser.uid,
            ownerName: niceName,
            participantIds: [currentUser.uid]
        };

        const result = await groupBuyService.createGroupBuy(formData);
        if (result.success) {
            alert("Published!");
            form.reset();
            costDisplay.value = "Shared Cost (No Extra Fee)";
            providerContainer.style.display = 'none';
            loadFindTab();
        } else {
            alert("Error creating.");
        }
    });
}

// --- SUBMIT COMMENT / REPLY ---
if (btnPostComment) {
    btnPostComment.addEventListener('click', async () => {
        if (!currentDetailItem) return;
        const currentUser = auth.currentUser;
        if (!currentUser) return alert("Please log in to comment.");
        
        const text = commentInput.value.trim();
        if (!text) return alert("Comment cannot be empty.");

        const niceName = currentUser.displayName || currentUser.email.split('@')[0];
        
        const commentData = {
            cid: Date.now() + Math.random().toString(16).slice(2), // Generate Unique Comment ID
            userId: currentUser.uid,
            userName: niceName,
            text: text,
            isPrivate: commentIsPrivate.checked,
            createdAt: Date.now(),
            parentId: replyingToId // If null, it's a top-level comment. If set, it's a reply.
        };

        btnPostComment.disabled = true;
        btnPostComment.innerText = "Posting...";

        const result = await groupBuyService.addComment(currentDetailItem.id, commentData);
        
        btnPostComment.disabled = false;
        btnPostComment.innerText = "Post Comment";

        if (result.success) {
            commentInput.value = "";
            commentIsPrivate.checked = false;
            resetReplyState(); // Exit reply mode
            
            const updatedItem = await groupBuyService.getGroupBuyById(currentDetailItem.id);
            openDetailView(updatedItem);
        } else {
            alert("Error posting comment.");
        }
    });
}
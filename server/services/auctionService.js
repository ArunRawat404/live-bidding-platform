const items = [
    { id: 1, title: 'Vintage Camera', price: 100, endTime: Date.now() + 1000 * 60, highestBidderId: null },
    { id: 2, title: 'Mechanical Keyboard', price: 250, endTime: Date.now() + 1000 * 60, highestBidderId: null },
];

/**
 * Places a bid atomically (simulated).
 * Returns { success: true, item: updatedItem } or { success: false, error: string }
 */
function placeBid(itemId, amount, userId) {
    const item = items.find((i) => i.id === itemId);

    if (!item) return { success: false, error: 'Item not found' };

    // Time Check
    if (Date.now() >= item.endTime) {
        return { success: false, error: 'Auction has ended' };
    }

    // Self-Bidding Check
    if (item.highestBidderId === userId) {
        return { success: false, error: 'You are already the highest bidder!' };
    }

    // Price Check
    if (amount <= item.price) {
        return { success: false, error: 'Bid must be higher than current price' };
    }

    // Update State
    item.price = amount;
    item.highestBidderId = userId;

    return { success: true, item };
}

function getItems() {
    items.forEach(item => {
        const timeSinceEnd = Date.now() - item.endTime;

        // reset if it ended more than 2 minutes ago (120000 ms)
        if (timeSinceEnd > 120000) {
            item.endTime = Date.now() + 1000 * 60 * 5;
            item.price = item.price;
            item.highestBidderId = null;
        }
    });

    return items;
}

module.exports = { placeBid, getItems };
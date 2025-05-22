// --- Total price calculation for delivery.html ---
document.addEventListener('DOMContentLoaded', function() {
    // Only run if on delivery.html
    if (!document.getElementById('total-price')) return;
    const priceMap = {
        // Förrätter
        "Texas Nachos": 79,
        "BBQ Chicken Wings": 89,
        "Jalapeño Poppers": 69,
        "Onion Rings": 59,
        "Mini Quesadillas": 65,
        "Chili Cheese Balls": 69,
        // Huvudrätter
        "Texas Brisket": 189,
        "BBQ Ribs": 179,
        "Grillad Kyckling": 159,
        "Vegetarisk Burger": 139,
        "Cheeseburger": 149,
        "Double Bacon Burger": 169,
        "Fish Tacos": 139,
        "BBQ Pulled Pork": 149,
        "Grillad Lax": 169,
        "Mac & Cheese": 119,
        "Chili con Carne": 139,
        "Steak & Fries": 199,
        "Vegansk Chili": 129,
        // Sidorätter
        "Pommes Frites": 39,
        "Majskolv": 35,
        "Coleslaw": 29,
        "Vitlöksbröd": 39,
        "Grönsallad": 35,
        // Desserter
        "Pecan Pie": 69,
        "Chokladfondant": 75,
        "Key Lime Pie": 69,
        "Banoffee Pie": 69,
        "Glass med Topping": 49,
        // Drycker
        "Cola, Fanta, Sprite": 25,
        "Texas Lemonade": 35,
        "Root Beer": 29,
        "Milkshake (Choklad, Jordgubb, Vanilj)": 49,
        "Kaffe": 25,
        "Te": 25,
        "Mineralvatten": 22
    };

    function updateTotalPrice() {
        const mealRows = document.querySelectorAll('#meals-list .meal-row');
        let total = 0;
        mealRows.forEach(row => {
            const meal = row.querySelector('input.menu-item-input').value;
            const qty = parseInt(row.querySelector('input[name="quantity"]').value) || 0;
            if (meal && priceMap[meal]) {
                total += priceMap[meal] * qty;
            }
        });
        document.getElementById('total-price').textContent = total > 0 ? `Totalt: ${total} kr` : '';
    }

    // Initial listeners for first row
    document.querySelectorAll('#meals-list input.menu-item-input, #meals-list input[name="quantity"]').forEach(el => {
        if (el.classList.contains('menu-item-input')) {
            el.addEventListener('click', openMenuPopup);
        } else {
            el.addEventListener('input', updateTotalPrice);
        }
    });
    updateTotalPrice();

    // Add/remove meal rows
    document.getElementById('add-meal').addEventListener('click', function() {
        const mealsList = document.getElementById('meals-list');
        const firstRow = mealsList.querySelector('.meal-row');
        const newRow = firstRow.cloneNode(true);
        newRow.querySelector('input.menu-item-input').value = '';
        newRow.querySelector('input[name="quantity"]').value = 1;
        newRow.querySelector('.remove-meal').style.display = 'inline-block';
        mealsList.appendChild(newRow);
        // Add listeners for new row
        newRow.querySelector('input.menu-item-input').addEventListener('click', openMenuPopup);
        newRow.querySelector('input[name="quantity"]').addEventListener('input', updateTotalPrice);
        updateTotalPrice();
    });
    document.getElementById('meals-list').addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-meal')) {
            e.target.parentElement.remove();
            updateTotalPrice();
        }
        // Hide remove button if only one row left
        const rows = document.querySelectorAll('#meals-list .meal-row');
        if (rows.length === 1) rows[0].querySelector('.remove-meal').style.display = 'none';
    });

    // Expose for popup
    window.updateTotalPrice = updateTotalPrice;
});
// Script to open the menu.html as a popup overlay for meal selection
function openMenuPopup(e) {
    // Create overlay
    let overlay = document.createElement('div');
    overlay.id = 'menu-popup-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.85)';
    overlay.style.zIndex = 9999;
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.innerHTML = `
        <div id="menu-popup-content" style="background:#1a120e; max-width:95vw; max-height:90vh; overflow:auto; border-radius:12px; box-shadow:0 4px 32px #000; padding:18px 10px 10px 10px; position:relative;">
            <button id="close-menu-popup" style="position:absolute; top:10px; right:18px; background:#ffb366; color:#1a120e; border:none; border-radius:50%; width:32px; height:32px; font-size:1.5em; cursor:pointer;">&times;</button>
            <iframe src="delivery_menu.html" style="width:90vw; max-width:600px; height:70vh; border:none; border-radius:8px; background:#fff;"></iframe>
        </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Listen for close
    document.getElementById('close-menu-popup').onclick = function() {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
    };

    // Listen for click on menu item in iframe
    overlay.querySelector('iframe').addEventListener('load', function() {
        const iframe = this;
        try {
            const menuDoc = iframe.contentDocument || iframe.contentWindow.document;
            menuDoc.querySelectorAll('.menu-item h3').forEach(item => {
                item.style.cursor = 'pointer';
                item.onclick = () => {
                    e.target.value = item.textContent;
                    document.body.removeChild(overlay);
                    document.body.style.overflow = '';
                    if (typeof updateTotalPrice === 'function') updateTotalPrice();
                };
            });
        } catch (err) {
            // If cross-origin, fallback: close only
        }
    });
}

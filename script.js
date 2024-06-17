document.addEventListener('DOMContentLoaded', () => {
    const menus = [
        { name: 'Pizza Margherita [Ø 32cm]', price: 8.50, description: 'Klassische Pizza mit Tomaten, Mozzarella und Basilikum.' },
        { name: 'Caesar Salad', price: 7.90, description: 'Salat mit Römersalat, Croutons, Parmesan und Caesar-Dressing.' },
        { name: 'Spaghetti Carbonara', price: 9.50, description: 'Pasta mit Speck, Ei, Parmesan und schwarzem Pfeffer.' },
        { name: 'Tiramisu', price: 5.00, description: 'Italienisches Dessert mit Mascarpone, Espresso und Kakao.' },
        { name: 'Pizza Salami [Ø 32cm]', price: 9.00, description: 'Pizza mit Tomaten, Mozzarella und Salami.' },
        { name: 'Lasagna', price: 10.50, description: 'Gebackene Pasta-Schichten mit Bolognese, Bechamel und Käse.' },
        { name: 'Minestrone Soup', price: 6.00, description: 'Italienische Gemüsesuppe mit Bohnen, Pasta und Kräutern.' },
        { name: 'Ravioli', price: 11.00, description: 'Gefüllte Teigtaschen mit Ricotta und Spinat in Tomatensauce.' },
        { name: 'Seafood Risotto', price: 13.50, description: 'Cremiges Risotto mit Meeresfrüchten und Weißwein.' },
        { name: 'Gelato', price: 4.50, description: 'Traditionelles italienisches Eis in verschiedenen Geschmacksrichtungen.' }
    ];

    const menuDisplay = document.getElementById('menuDisplay');
    if (menuDisplay) {
        menus.forEach((item, index) => {
            const menuItem = document.createElement('div');
            menuItem.classList.add('item');
            menuItem.innerHTML = `
                <h2>${item.name}<div class="info-icon tooltip" data-index="${index}">i<span class="tooltiptext">Mehr Information</span></div></h2>
                <p>${item.description}</p>
                <span>€${item.price.toFixed(2)}</span>
                <button data-index="${index}" class="add-to-cart-button">+</button>
            `;
            menuDisplay.appendChild(menuItem);
        });
    }

    let cartItems = [];
    let currentMenuIndex = null;

    const loadCart = () => {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            cartItems = JSON.parse(storedCart);
        }
    };

    const saveCart = () => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    };

    const updateCartDisplay = () => {
        const cartItemsElement = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        if (cartItemsElement && cartTotal) {
            cartItemsElement.innerHTML = cartItems.map((item, index) =>
                `<li>
                    ${item.name} - €${item.price.toFixed(2)} (x${item.amount})
                    ${item.extras && item.extras.length > 0 ? `<br>Zutaten: ${item.extras.join(', ')}` : ''}
                    <div class="item-controls">
                        <button class="control-button" onclick="decreaseAmount(${index})">-</button>
                        <button class="control-button" onclick="increaseAmount(${index})">+</button>
                        <button class="control-button remove-button" onclick="removeFromCart(${index})">Löschen</button>
                    </div>
                </li>`
            ).join('');
            const total = cartItems.reduce((sum, item) => sum + (item.price * item.amount), 0);
            cartTotal.textContent = `Gesamt: €${total.toFixed(2)}`;
        } else {
            console.error('Elements with IDs "cartItems" or "cartTotal" not found.');
        }
    };

    const addToCart = (menuIndex, extras = []) => {
        const itemIndex = cartItems.findIndex(item => item.name === menus[menuIndex].name && JSON.stringify(item.extras) === JSON.stringify(extras));
        if (itemIndex > -1) {
            cartItems[itemIndex].amount += 1;
        } else {
            cartItems.push({
                name: menus[menuIndex].name,
                price: menus[menuIndex].price + extras.length * 1.5,
                amount: 1,
                extras: extras
            });
        }
        updateCartDisplay();
        saveCart();
        removeCheckmarks();
        const extraOptions = document.getElementById('extraOptions');
        if (extraOptions) extraOptions.style.display = 'none';
    };

    const openExtraOptions = (menuIndex) => {
        currentMenuIndex = menuIndex;
        const extraOptions = document.getElementById('extraOptions');
        if (extraOptions) extraOptions.style.display = 'block';
    };

    const removeCheckmarks = () => {
        document.querySelectorAll('#extraOptions input:checked').forEach(input => {
            input.checked = false;
        });
    };

    const menuDisplayElement = document.getElementById('menuDisplay');
    if (menuDisplayElement) {
        menuDisplayElement.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') {
                const menuIndex = parseInt(event.target.getAttribute('data-index'));
                if (menus[menuIndex].name.includes('Pizza')) {
                    openExtraOptions(menuIndex);
                } else {
                    addToCart(menuIndex);
                }
            } else if (event.target.closest('.info-icon')) {
                openInfoModal();
            }
        });
    }

    const addExtrasButton = document.getElementById('addExtrasButton');
    if (addExtrasButton) {
        addExtrasButton.addEventListener('click', () => {
            const extras = Array.from(document.querySelectorAll('#extraOptions input:checked')).map(input => input.value);
            if (currentMenuIndex !== null) {
                addToCart(currentMenuIndex, extras);
                const extraOptions = document.getElementById('extraOptions');
                if (extraOptions) extraOptions.style.display = 'none';
            }
        });
    }

    window.decreaseAmount = (index) => {
        if (cartItems[index].amount > 1) {
            cartItems[index].amount -= 1;
            updateCartDisplay();
            saveCart();
        }
    };

    window.increaseAmount = (index) => {
        cartItems[index].amount += 1;
        updateCartDisplay();
        saveCart();
    };

    window.removeFromCart = (index) => {
        cartItems.splice(index, 1);
        updateCartDisplay();
        saveCart();
    };

    window.scrollToSection = (sectionId) => {
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    };

    window.openInfoModal = () => {
        const infoModal = document.getElementById('infoModal');
        if (infoModal) infoModal.style.display = 'block';
    };

    window.closeInfoModal = () => {
        const infoModal = document.getElementById('infoModal');
        if (infoModal) infoModal.style.display = 'none';
    };

    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', closeInfoModal);
    }

    const cart = document.getElementById('cart');
    const isDesktop = window.matchMedia("(min-width: 646px)");

    const handleScroll = () => {
        const header = document.getElementById('header');
        if (header && cart) {
            const headerHeight = header.offsetHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            cart.style.top = `${Math.max(headerHeight, scrollTop + 20)}px`;
        }
    };

    if (isDesktop.matches) {
        window.addEventListener('scroll', handleScroll);
    }

    isDesktop.addEventListener('change', (e) => {
        if (e.matches) {
            window.addEventListener('scroll', handleScroll);
        } else {
            window.removeEventListener('scroll', handleScroll);
        }
    });

    loadCart();
    updateCartDisplay();

    // Scroll to bottom of the cart when an item is added
    let itemCount = 0;

    function scrollToBottom() {
        const cartElement = document.getElementById('cartItems');
        if (cartElement) cartElement.scrollTop = cartElement.scrollHeight;
    }

    function addItemToCart() {
        itemCount++;
        const cartElement = document.getElementById('cartItems');
        if (cartElement) {
            const newItem = document.createElement('li');
            newItem.className = 'item';
            newItem.textContent = 'Artikel ' + itemCount;
            cartElement.appendChild(newItem);
            scrollToBottom();
        }
    }

    const addToCartButton = document.getElementById('add-to-cart-button');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', addItemToCart);
    }
});

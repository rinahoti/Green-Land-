document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    function updateCartCount() {
      const itemCountElement = document.querySelector('.item-pg');
      if (itemCountElement) {
        itemCountElement.textContent = `You have ${cart.length} items in your cart`;
      }
    }
  
    function displayCart() {
      const cartItemsList = document.querySelector('.cart-items-list');
      cartItemsList.innerHTML = '';
  
      if (cart.length === 0) {
        cartItemsList.innerHTML = '<p>Your cart is empty.</p>';
      } else {
        cart.forEach(item => {
          const cartItemDiv = document.createElement('div');
          cartItemDiv.classList.add('cart-item');
          cartItemDiv.dataset.id = item.id;
          cartItemDiv.innerHTML = `
                      <img src="${item.thumbnail}" alt="${item.title}">
                      <div class="item-details">
                          <h4 class="food-title">${item.title}</h4>
                          <p class="description-food">${item.description || 'No description available'}</p>
                      </div>
                      <div class="item-quantity">
                          <span class="quantity-display" data-id="${item.id}">${item.quantity}</span>
                          <div class="quantity-buttons">
                              <img src="https://pplx-res.cloudinary.com/image/upload/v1739234166/user_uploads/TKpnrSWRvkfnQmj/Rectangle-6.jpg" alt="Rrit" style="width: 20px; height: 20px; cursor: pointer;" class="quantity-btn quantity-up" data-id="${item.id}">
                              <img src="https://pplx-res.cloudinary.com/image/upload/v1739234320/user_uploads/AlABVYGdGNGVAgw/Rectangle-7-1.jpg" alt="Zbrit" style="width: 20px; height: 20px; cursor: pointer;" class="quantity-btn quantity-down" data-id="${item.id}">
                          </div>
                      </div>
                      <div class="item-price">
                          <span data-price="${item.price}">$${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <button class="delete-button" data-id="${item.id}">
                          <i class="fa-regular fa-trash-can"></i>
                      </button>
                  `;
          cartItemsList.appendChild(cartItemDiv);
        });
      }
  
      updateSummary();
      updateCartCount();
      attachEventListeners();
    }
  
    function attachEventListeners() {
      const deleteButtons = document.querySelectorAll('.delete-button');
      const quantityUpButtons = document.querySelectorAll('.quantity-up');
      const quantityDownButtons = document.querySelectorAll('.quantity-down');
  
      deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
          const productId = parseInt(event.target.dataset.id || event.target.closest('.delete-button').dataset.id);
          const cartItemElement = event.target.closest('.cart-item');
  
          if (cartItemElement) {
            removeCartItem(productId, cartItemElement);
          }
        });
      });
  
      quantityUpButtons.forEach(button => {
        button.addEventListener('click', (event) => {
          const productId = parseInt(button.dataset.id);
          const quantityDisplay = button.parentNode.parentNode.querySelector('.quantity-display');
          let newQuantity = parseInt(quantityDisplay.textContent) + 1;
          updateCartItemQuantity(productId, newQuantity, button.closest('.cart-item'));
        });
      });
  
      quantityDownButtons.forEach(button => {
        button.addEventListener('click', (event) => {
          const productId = parseInt(button.dataset.id);
          const quantityDisplay = button.parentNode.parentNode.querySelector('.quantity-display');
          let newQuantity = parseInt(quantityDisplay.textContent) - 1;
          if (newQuantity > 0) {
            updateCartItemQuantity(productId, newQuantity, button.closest('.cart-item'));
          } else {
            removeCartItem(productId, button.closest('.cart-item'));
          }
        });
      });
    }
  
    function updateCartItemQuantity(productId, newQuantity, cartItemElement) {
      cart = cart.map(item => {
        if (item.id === productId) {
          item.quantity = newQuantity;
        }
        return item;
      });
      updateCart();
  
      if (cartItemElement) {
        const item = cart.find(item => item.id === productId);
        const itemPriceSpan = cartItemElement.querySelector('.item-price span');
        const quantityDisplay = cartItemElement.querySelector('.quantity-display');
        const unitPrice = parseFloat(itemPriceSpan.dataset.price);
  
        if (itemPriceSpan && quantityDisplay) {
          itemPriceSpan.textContent = `$${(unitPrice * newQuantity).toFixed(2)}`;
          quantityDisplay.textContent = newQuantity;
        }
      }
  
      updateSummary();
      updateCartCount();
    }
  
    function removeCartItem(productId, cartItemElement) {
      cart = cart.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(cart));
  
      if (cartItemElement) {
        cartItemElement.remove();
      }
  
      if (cart.length === 0) {
        const cartItemsList = document.querySelector('.cart-items-list');
        cartItemsList.innerHTML = '<p>Your cart is empty.</p>';
      }
  
      updateSummary();
      updateCartCount();
    }
  
    function updateCart() {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  
    function calculateSummary() {
      let subtotal = 0;
      cart.forEach(item => {
        subtotal += item.price * item.quantity;
      });
  
      let shipping = 4;
      if (cart.length === 0) {
        shipping = 0;
      }
      const total = subtotal + shipping;
  
      return {
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2)
      };
    }
  
    function updateSummary() {
      const summary = calculateSummary();
  
      document.querySelector('.summary p:nth-child(1) span').textContent = `$${summary.subtotal}`;
      document.querySelector('.summary p:nth-child(2) span').textContent = `$${summary.shipping}`;
      document.querySelector('.summary p:nth-child(3) span').textContent = `$${summary.total}`;
  
      document.querySelector('.checkout-button .amount').textContent = `$${summary.total}`;
  
      if (cart.length === 0) {
        document.querySelector('.summary p:nth-child(1) span').textContent = '$0.00';
        document.querySelector('.summary p:nth-child(2) span').textContent = '$0.00';
        document.querySelector('.summary p:nth-child(3) span').textContent = '$0.00';
        document.querySelector('.checkout-button .amount').textContent = '$0.00';
      }
    }
  
    function formatCardNumber(input) {
      const value = input.value.replace(/\D/g, '').substring(0, 16);
      const parts = [];
      for (let i = 0; i < value.length; i += 4) {
        parts.push(value.substring(i, i + 4));
      }
  
      input.value = parts.join(' ');
    }
  

    function formatExpirationDate(input) {
      let value = input.value.replace(/\D/g, '').substring(0, 4); 
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
      }
      input.value = value;
    }
  

    function formatCvv(input) {
      input.value = input.value.replace(/\D/g, '').substring(0, 3);
    }
  
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
      cardNumberInput.addEventListener('input', () => {
        formatCardNumber(cardNumberInput);
      });
    }
  
    const expirationInput = document.getElementById('expiration');
    if (expirationInput) {
      expirationInput.addEventListener('input', () => {
        formatExpirationDate(expirationInput);
      });
    }
  
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
      cvvInput.addEventListener('input', () => {
        formatCvv(cvvInput);
      });
    }
  

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('keydown', function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
        }
      });
    }
  
    const nameInput = document.getElementById('name');
    if (nameInput) {
      nameInput.addEventListener('input', function (event) {

        this.value = this.value.replace(/[^A-Za-z\s]/g, '');
  

        if (this.value.length === 1) {
          this.value = this.value.charAt(0).toUpperCase();
        } else if (this.value.length > 1 && this.value.charAt(0) !== this.value.charAt(0).toUpperCase()) {
          this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1);
        }
      });
    }
  
    document.getElementById('checkout-form').addEventListener('submit', function (event) {
      event.preventDefault(); 

      const nameInput = document.getElementById('name');
      const nameError = document.getElementById('name-error');
      const cardNumberInput = document.getElementById('card-number');
      const cardNumberError = document.getElementById('card-number-error');
      const expirationInput = document.getElementById('expiration');
      const expirationError = document.getElementById('expiration-error');
      const cvvInput = document.getElementById('cvv');
      const cvvError = document.getElementById('cvv-error');

      const nameLabel = document.querySelector('label[for="name"]');
      const cardNumberLabel = document.querySelector('label[for="card-number"]');
      const expirationLabel = document.querySelector('label[for="expiration"]');
      const cvvLabel = document.querySelector('label[for="cvv"]');
  
      let isValid = true;
  


      nameInput.classList.remove('input-error');
      cardNumberInput.classList.remove('input-error');
      expirationInput.classList.remove('input-error');
      cvvInput.classList.remove('input-error');
  
      nameLabel.classList.remove('label-error');
      cardNumberLabel.classList.remove('label-error');
      expirationLabel.classList.remove('label-error');
      cvvLabel.classList.remove('label-error');
  
      if (nameInput.value.trim() === '') {
        nameInput.classList.add('input-error');
        nameError.textContent = 'Name should be filled';
        nameLabel.classList.add('label-error');
        isValid = false;
      } else {
        nameInput.classList.remove('input-error');
        nameError.textContent = '';
      }
  
      const cardNumberValue = cardNumberInput.value.replace(/\s/g, '');
      if (cardNumberValue.trim() === '' || cardNumberValue.length < 16) {
        cardNumberInput.classList.add('input-error');
        cardNumberError.textContent = 'Card Number should be 16 digits';
        cardNumberLabel.classList.add('label-error');
        isValid = false;
      } else {
        cardNumberInput.classList.remove('input-error');
        cardNumberError.textContent = '';
      }



      if (expirationInput.value.trim() === '') {
        expirationInput.classList.add('input-error');
        expirationError.textContent = 'Expiration date should be filled';
        expirationLabel.classList.add('label-error');
        isValid = false;
      } else if (!/^\d{2}\/\d{2}$/.test(expirationInput.value)) {
        expirationInput.classList.add('input-error');
        expirationError.textContent = 'Expiration date should be filled';
        expirationLabel.classList.add('label-error');
        isValid = false;
      } else {
        expirationInput.classList.remove('input-error');
        expirationError.textContent = '';
      }
  
      if (cvvInput.value.trim() === '') {
        cvvInput.classList.add('input-error');
        cvvError.textContent = 'CVV should be 3 digits';
        cvvLabel.classList.add('label-error');
        isValid = false;
      } else if (cvvInput.value.length < 3) {
        cvvInput.classList.add('input-error');
        cvvError.textContent = 'CVV should be 3 digits';
        cvvLabel.classList.add('label-error');
        isValid = false;
      } else {
        cvvInput.classList.remove('input-error');
        cvvError.textContent = '';
      }
  
      if (isValid) {
        const successModal = document.getElementById('success-modal');
        successModal.style.display = "flex";
  
        cart = [];
        updateCart(); 
        displayCart();
        nameInput.value = '';
        cardNumberInput.value = '';
        expirationInput.value = '';
        cvvInput.value = '';
  
        setTimeout(() => {
          successModal.style.display = "none";
        }, 3000);
      }
    });
  
    displayCart();
  });
  
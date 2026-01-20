
/* #region: elements + globals */
const gallery = document.querySelector('.gallery');

const cart = document.querySelector('.cart');

/* CART : the UL containing the cart__item li-s */
const cartList = document.querySelector('.cart__items');

/* CART: the whole inner cart part to show - hide */
const cartFilled = document.querySelector('.cart__contents');

/* CART: the whole empty cart part to show-hide */
const cartEmpty = document.querySelector('.cart__empty');

/* CART: total value of items in the cart */
let cartTotal = document.querySelector('.cart__amount');

/* CART: the number of items in the cart */
let cartItemsNum = document.querySelector('.cart__items-num');

/* page cover under confirm */
const pageCover = document.querySelector('.page-cover');

/* the whole confirm modal to show -hide */
const confirmModal = document.querySelector('.order-confirm');

/* the UL part in the confirm modal for the  */
const confirmList = document.querySelector('.order-confirm__list');

const confirmTotal = document.querySelector('.order-confirm__sum');


const cartContents = [];

let productsData = [];

/*#endregion */

/*#region: getters */
const getProductItemTemplate = function( productData ){

  const {
    id,
    name,
    category,
    price,
    image,
    number = 0
    } = productData;

  const isInCart = number > 0;

  const template = `

          <article class="product ${isInCart === true ? 'product--in-cart' : ''}" data-product-id="${id}">
          <picture class="product__image">
            <source media="(max-width: 449px)" srcset="${image.mobile}" />
            <source media="(max-width: 980px)" srcset="${image.tablet}" />
            <img src="${image.desktop}" alt="${name}" loading="lazy">
          </picture>
          <button class="product__button ${ isInCart === true ? 'nodisplay' : ''}" data-action="add-to-cart" aria-label="Add to cart" data-product-id="${id}">
            <svg width="21" height="20" aria-hidden="true">
              <use href="#icon-add-to-cart"></use>
            </svg>
            Add to cart
          </button>

          <div class="product__quantity quantity ${ isInCart === true ? '' : 'nodisplay'}" data-action="change-cart">
            <button class="quantity__btn quantity__btn--decrease" aria-label="Decrease quantity" data-product-id="${id}">
              <svg width="10" height="2" aria-hidden="true">
                <use href="#icon-decrement"></use>
              </svg>
            </button>

            <span class="quantity__value" aria-live="polite">${number}</span>

            <button class="quantity__btn quantity__btn--increase" aria-label="Increase quantity" data-product-id="${id}">
              <svg width="10" height="10" aria-hidden="true">
                <use href="#icon-increment"></use>
              </svg>
            </button>
          </div>

          <p class="product__category">${category}</p>
          <h3 class="product__name">${name}</h3>
          <p class="product__price">${formatCurrency(price)}</p>
        </article>
  `;

return template;
};

const getCartItemTemplate = function( cartItemData ){

  const {
      id,
      name,
      number,
      price
  } = cartItemData;

  const template = `
<li class="cart__item">
<h4 class="cart__item-name">${name}</h4>
<p class="cart__item-details">
  <span class="cart__item-number">${number}x</span>
  <span class="cart__item-unit-price">${formatCurrency(price)}</span>
  <span class="cart__item-sum">${formatCurrency(price * number)}</span>
</p>
<button class="cart__item-delete" data-product-id="${id}" aria-label="remove ${name} from cart">
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
    <path
      d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
  </svg>
</button>
</li>
  `;
return template;
};

const getConfirmItemTemplate = function( cartItemData ){
  const {
    id,
    name,
    category,
    price,
    image,
    number = 0
    } = cartItemData;

    const template = `
        <li class="order-confirm__item confirm-item">
          <div class="confirm__details">
            <img class="confirm__icon" src="${image.mobile}" alt="${name}">
            <span class="confirm__name">${name}</span>
            <span class="confirm__meta">
              <span class="confirm__qty">${number}x</span>
              <span class="confirm__price">${formatCurrency(price)}</span>
            </span>
          </div>
          <span class="confirm__sum">${formatCurrency(number * price)}</span>
        </li>
    `;

    return template;
};
/*#endregion */

/* #region: cart methods */
const addToCart = function(id){

const product = productsData
.find( data => data.id === id);

const isProductInCart = cartContents
.some( product => product.id === id);

if( !product || isProductInCart ) return;

cartContents.push( { ...product, number: 1});

updateUI();
}

const calcDisplayCart = function(){

cartList.innerHTML = '';

const isCartVisible =
cartEmpty
.classList
.contains('nodisplay');

if( isCartVisible && cartContents.length === 0 ){

    cartEmpty.classList.remove('nodisplay');
    cartFilled.remove();
    cart.appendChild(cartEmpty);
}
else if( !isCartVisible ){

    cartEmpty.classList.add('nodisplay');
    cartEmpty.remove();
    cart.appendChild(cartFilled);
}

let total = 0;
const cartItemsNumber = cartContents.length;

cartContents.forEach( cartItem => {

const{
  price,
  number
} = cartItem;

total += price * number;

const productHTML = getCartItemTemplate( {...cartItem } );

cartList.insertAdjacentHTML('beforeend', productHTML);
})
  cartTotal.textContent = `\$${total}`;
  cartItemsNum.textContent = cartItemsNumber;

};

const isInCart = function( id ){
  const product = cartContents
  .find( product => product.id === id );

  return product;
}

const updateUI = function(){

  displayProducts();
  calcDisplayCart();
}

const moreToCart = function(id){

  const product = isInCart( id );

  if( !product ) return;

  product.number += 1;

  updateUI();

}

const lessToCart = function( id ){

  const product = isInCart( id );
  if( !product ) return;

if (product.number === 1) {
    cartContents.splice(cartContents.indexOf(product), 1);
} else {
    product.number -= 1;
}
  updateUI();

}

const deleteFromCart = function( id ){

  const product = isInCart( id );
  if( !product ) return;

  const productIndex = cartContents.indexOf( product );
  cartContents.splice(productIndex, 1);

  updateUI();

}
/*#endregion */


const displayProducts = function(){

  gallery.innerHTML = '';

productsData.forEach(

  product => {

    const cartItem = cartContents
    .find( item => item.id === product.id );

    const templateData = cartItem
      ?  {...product, ...cartItem }
      : {...product, number : 0 };

      const productHTML = getProductItemTemplate( templateData );
      gallery.insertAdjacentHTML('beforeend', productHTML);

    });
};


const calcDisplayConfirm = function(){

let total = 0;
confirmList.innerHTML = '';


cartContents.forEach( cartItem => {

  const { number, price } = cartItem;
  total += number * price;

  const productHTML = getConfirmItemTemplate({ ...cartItem });
  confirmList.insertAdjacentHTML('beforeend', productHTML);
});


confirmTotal.textContent = `${formatCurrency(total)}`;
toggleConfirmAndCover();

};

const toggleConfirmAndCover = function(){

  confirmModal.classList.toggle('nodisplay');
  pageCover.classList.toggle('nodisplay');
};

const formatCurrency = function( figure ){

  const locale = navigator.languages
  ? navigator.languages[ 0 ]
  : navigator.language;

  return new Intl.NumberFormat( locale,
    {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits : 2
    }
  ).format( figure );
}

/* #region: INTERACTIONS */




/*
INTERACTIONS:
1.) az oldal betöltődése:
    prepareData();
    displayProducts();

2.) a gallery-ben rákattint az 'Add to cart' gombra:
addItemToCart(id);

3.) a gallery-ben növeli - csökkenti a termék mennyiségét:
    moreToCart(id);
    lessToCart(id);

4.) a cart részen rákattint az egyik termék mellett az x ( törlés) gombra:
    deleteFromCart(id);

5.) rákattint a 'Confirm Order' gombra:

    displayConfirm();


6.)  rákattint a 'start New Order" gombra:
eltűnnek a : confirm modal + a page cover elemek

kiürítem a cartContents tömböt és kiíratom a productsData tömb tartalmát a gallery-be
a cart részen az üres template-re cserélem a content részt.

*/

/*#endregion */

gallery.addEventListener('click',
   ( e ) => {

    e.preventDefault();
    const activeSelectors = [
      '.product__button',
      '.quantity__btn--increase',
      '.quantity__btn--decrease'
    ];

    let target = e.target;

    const activeSelector = activeSelectors
    .find( selector  => target.closest( selector ));

    if( !activeSelector ) return;

    target = target.closest( activeSelector );

    const productId = target.dataset.productId;

    switch( activeSelector ){

      case '.product__button': addToCart( productId );
      break;

      case '.quantity__btn--increase': moreToCart( productId );
      break;

      case '.quantity__btn--decrease': lessToCart( productId);
      break;
    };
  }
);

cart.addEventListener('click',
  ( e ) => {

    e.preventDefault();
   const actions = {
      '.cart__item-delete' : deleteFromCart,
      '.btn--order' : calcDisplayConfirm
    }

    const activeSelectors = Object.keys( actions );
    const target = e.target;


    const activeSelector =
    activeSelectors
    .find( selector => target.closest( selector ));

    if( ! activeSelector ) return;

    const activeElement = target.closest( activeSelector );
    const productId = activeElement.dataset.productId;

    actions[ activeSelector ]( productId );


  });

document.body.addEventListener('click',
  ( e ) => {

  e.preventDefault();

    const activeSelectors = ['.btn--confirm', '.page-cover' ];
    const target = e.target;

    const activeSelector = activeSelectors
    .find( selector => target.closest( selector ));

    if( !activeSelector ) return;

    cartContents.length = 0;
    updateUI();
    toggleConfirmAndCover();
  });


/* #endregion */



async function loadProducts() {
  try {
    const response = await fetch('./data.json');

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    let id = 1;

    // Generate IDs for the data objects
    data.forEach(
      obj => obj.id =
      String(id++)
      .padStart(2, '0')
    );

    productsData = data;
    displayProducts();

  } catch (error) {
    // Log the error for the developer
    console.error("Failed to load products:", error);

    // Provide feedback to the user in the gallery area
    gallery.innerHTML = `
      <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <p>Wait, something went wrong while loading the desserts.</p>
        <p style="font-size: var(--fs-1_4); color: var(--clr-primary-400);">
          ${error.message}
        </p>
        <button onclick="location.reload()" class="product__button" style="margin-top: 1rem; display: inline-flex;">
          Try Again
        </button>
      </div>
    `;
  }
}


/* load JSON file with product data */
loadProducts();

// calcDisplayCart();
updateUI();


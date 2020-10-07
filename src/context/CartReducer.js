import { saveInStorage } from '../utils/persistStorage';

export const CartReducer = (state, action) => {
   switch (action.type) {
      case 'INCREASE':
         const increasedIndex = state.cartItems.findIndex(
            (item) => item._id === action.payload.product._id && item.size === action.payload.size
         );
         state.cartItems[increasedIndex].quantity++;
         return {
            ...state,
            cartItems: [...state.cartItems],
            ...sumItems(state.cartItems),
         };
      case 'DECREASE':
         const decreasedIndex = state.cartItems.findIndex(
            (item) => item._id === action.payload.product._id && item.size === action.payload.size
         );
         if (state.cartItems[decreasedIndex].quantity === 1) {
            state.cartItems.splice(decreasedIndex, 1);
         } else {
            state.cartItems[decreasedIndex].quantity--;
         }
         return {
            ...state,
            cartItems: [...state.cartItems],
            ...sumItems(state.cartItems),
         };
      case 'ADD_PRODUCT':
         const exist = state.cartItems.find(
            (item) =>
               item._id === action.payload.currentProduct._id && item.size === action.payload.size
         );
         if (exist) {
            const addedIndex = state.cartItems.findIndex(
               (item) => item._id === action.payload.currentProduct._id
            );
            state.cartItems[addedIndex].quantity++;
         } else {
            state.cartItems.push({
               _id: action.payload.currentProduct._id,
               price: action.payload.currentProduct.price,
               size: action.payload.size,
               quantity: action.payload.qty,
            });
         }
         return {
            ...state,
            cartItems: [...state.cartItems],
            ...sumItems(state.cartItems),
         };
      case 'REMOVE_PRODUCT':
         const removeIndex = state.cartItems.findIndex(
            (item) => item._id === action.payload.product._id && item.size === action.payload.size
         );
         state.cartItems.splice(removeIndex, 1);
         return {
            ...state,
            cartItems: [...state.cartItems],
            ...sumItems(state.cartItems),
         };
      default:
         return;
   }
};

export const sumItems = (cartItems) => {
   saveInStorage('cart', cartItems);
   let itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
   let total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
   return { itemCount, total };
};

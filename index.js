'use strict';

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  checkFilter: false,
  searchVal: ''
};

function changeTitle(val,index){
  STORE.items[index].name = val; 
}

function changeTitleListener(){
  $('.js-shopping-list').on('click', '#change-title-button', event => {
    const val = $(event.currentTarget).closest('li').find('.change-title').val();
    const index = $(event.currentTarget).closest('li').data('item-index');
    changeTitle(val,index);
    renderShoppingList();
  });
}

function filterSearchName(val){
  STORE.searchVal = val;
}

function searchListener(){
  $('#search-button').click(event => {
    let searchVal = $('#search-text').val(); 
    filterSearchName(searchVal);
    renderShoppingList();
  });
}

function showALL(){
  $('#show-all').click( event => {
    STORE.searchVal = '';
    renderShoppingList();
  });
}

function filterChecked(bool){
  if(bool) STORE.checkFilter = true;
  if(!bool) STORE.checkFilter = false;
}

function checkedListener(){
  $('#check-box').on('click', event => {
    let isChecked = $(event.currentTarget).is(':checked'); 
    filterChecked(isChecked);
    renderShoppingList();
  });
}

function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${STORE.items.indexOf(item)}">
      <input type="text" name="change-title" class="change-title" placeholder="change-title">
      <button type="button" id="change-title-button">Change</button>
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join('');
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  let filteredItems = STORE.items;
  if(STORE.checkFilter === true) filteredItems = STORE.items.filter(item => item.checked === true);
  if(STORE.searchVal !== '' && STORE.checkFilter === false) filteredItems = STORE.items.filter( item => item.name === STORE.searchVal);
  //if(STORE.filteredItems.length === 0) STORE.filteredItems = STORE.items;
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  if(itemName == '') return;
  STORE.items.push({name: itemName, checked: false});

}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteList(itemIndex){
  STORE.items.splice(itemIndex, 1);
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', function(e){
    const itemIndex = getItemIndexFromElement($(this));
    deleteList(itemIndex);
    renderShoppingList();
  });
  console.log('`handleDeleteItemClicked` ran');
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  checkedListener();
  searchListener();
  showALL();
  changeTitleListener();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);
import {setStartPosition, recordStartingAddress, setMoveMainMarker} from './map.js';
import {sendData} from './server-connection.js';
import {getSuccess as getSuccessMessage, getError as getErrorMessage} from './status-messages.js';
import {createImage} from './element-constructor.js';

const MINIMUM_PRICES = {
  bungalow: 0,
  flat: 1000,
  house: 5000,
  palace: 10000,
};
const MIN_TITLE_LENGTH = 30;
const MAX_TITLE_LENGTH = 100;
const FILE_TYPES = ['jpg', 'jpeg', 'png'];
const ad = document.querySelector('.ad-form');
const addressInput = ad.querySelector('#address');
const titleInput = ad.querySelector('#title');
const priceInput = ad.querySelector('#price');
const pricePerNight = ad.querySelector('#price');
const houseType = ad.querySelector('#type');
const timesIn = ad.querySelector('#timein');
const timesOut = ad.querySelector('#timeout');
const numberOfRooms = ad.querySelector('#room_number');
const numberOfGuests = ad.querySelector('#capacity');
const mapFilters = document.querySelector('.map__filters');
const clearButton = ad.querySelector('.ad-form__reset');
const avatarLoadButton = ad.querySelector('.ad-form__field input[type=file]');
const avatarPreview = ad.querySelector('.ad-form-header__preview');
const avatar = avatarPreview.querySelector('img');
const photoHousingLoadButton = ad.querySelector('.ad-form__upload input[type=file]');
const photoHousinPreview = ad.querySelector('.ad-form__photo');

const setMinPricePerNight = (houseType) => {
  pricePerNight.setAttribute('placeholder', String(MINIMUM_PRICES[houseType]));
  pricePerNight.setAttribute('min', String(MINIMUM_PRICES[houseType]));
};

houseType.addEventListener('change', () => {
  setMinPricePerNight(houseType.value);
});

const syncSelectByIndex = (firstSelect, secondSelect) => {
  firstSelect.addEventListener('change', () => {
    secondSelect.selectedIndex = firstSelect.selectedIndex;
  });
  secondSelect.addEventListener('change', () => {
    firstSelect.selectedIndex = secondSelect.selectedIndex;
  });
};

const clear = () => {
  ad.reset();
  mapFilters.reset();
  setStartPosition();
  recordStartingAddress(addressInput);
};

clearButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  clear();
});

const setTitleValidation = () => {
  const valueLength = titleInput.value.length;

  if (valueLength < MIN_TITLE_LENGTH) {
    titleInput.setCustomValidity(`Заголовок долже состоять минимум из 30-ти символов ещё ${MIN_TITLE_LENGTH - valueLength} симв.`);
  }
  else if (valueLength > MAX_TITLE_LENGTH) {
    titleInput.setCustomValidity('Заголовок может состоять максимум из 100 символов удалите лишние ' + (valueLength - MAX_TITLE_LENGTH) +' симв.');
  }
  else {
    titleInput.setCustomValidity('');
  }
  titleInput.reportValidity();
};

titleInput.addEventListener('input', setTitleValidation);

const setPriceValidation = () => {
  const valuePrice = priceInput.value;

  if (Number(priceInput.getAttribute('min')) > valuePrice) {
    priceInput.setCustomValidity(`Цена за ночь не может быть меньше ${priceInput.getAttribute('min')}.`);
  }
  else {
    priceInput.setCustomValidity('');
  }
  priceInput.reportValidity();
};

houseType.addEventListener('change', setPriceValidation);
priceInput.addEventListener('input', setPriceValidation);

const setCapacityValidation = () => {
  if(Number(numberOfRooms.value) === 100 && Number(numberOfGuests.value) !== 0) {
    numberOfGuests.setCustomValidity('100 комнат доступны только не для гостей.');
  }
  else if(Number(numberOfRooms.value) !== 100 && Number(numberOfGuests.value) === 0) {
    numberOfGuests.setCustomValidity('Не для гостей доступны только 100 комнат.');
  }
  else if(Number(numberOfRooms.value) < Number(numberOfGuests.value)) {
    numberOfGuests.setCustomValidity('Количество гостей не может быть больше комнат.');
  }
  else {
    numberOfGuests.setCustomValidity('');
  }
  numberOfGuests.reportValidity();
}

numberOfRooms.addEventListener('change', setCapacityValidation);
numberOfGuests.addEventListener('change', setCapacityValidation);

const setloadImage = (loadButton, preview) => {
  const file = loadButton.files[0];
  const fileName = loadButton.files[0].name.toLowerCase();
  let photo = preview;
  const matches = FILE_TYPES.some((extension) => {
    return fileName.endsWith(extension);
  });

  if(photo.tagName === 'DIV') {
    photo = createImage();
    preview.style.position = 'relative';
    preview.appendChild(photo);
  }

  if(matches){
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      photo.src = reader.result;
    });

    reader.readAsDataURL(file);
  }
};

avatarLoadButton.addEventListener('change',() => setloadImage(avatarLoadButton, avatar));
photoHousingLoadButton.addEventListener('change',() => setloadImage(photoHousingLoadButton, photoHousinPreview));

const setSendingData = () => {
  ad.addEventListener('submit', (evt) => {
    evt.preventDefault();
    sendData(getSuccessMessage, getErrorMessage, new FormData(evt.target));
  });
};

recordStartingAddress(addressInput);
setMoveMainMarker(addressInput);
setMinPricePerNight(houseType.value);
setCapacityValidation();
syncSelectByIndex(timesIn, timesOut);
setSendingData();


export {clear};



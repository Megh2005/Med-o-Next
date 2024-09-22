const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
const PAGINATION_OFFSET = 10;
const PINCODE_REGEX = /^[1-9][0-9]{5}$/;
const BACKEND_URL = "https://med-o-shop.onrender.com";

const STATES = {
  andhra_pradesh: "Andhra Pradesh",
  arunachal_pradesh: "Arunachal Pradesh",
  assam: "Assam",
  bihar: "Bihar",
  chhattisgarh: "Chhattisgarh",
  goa: "Goa",
  gujarat: "Gujarat",
  haryana: "Haryana",
  himachal_pradesh: "Himachal Pradesh",
  jharkhand: "Jharkhand",
  karnataka: "Karnataka",
  kerala: "Kerala",
  madhya_pradesh: "Madhya Pradesh",
  maharashtra: "Maharashtra",
  manipur: "Manipur",
  meghalaya: "Meghalaya",
  mizoram: "Mizoram",
  nagaland: "Nagaland",
  odisha: "Odisha",
  punjab: "Punjab",
  rajasthan: "Rajasthan",
  sikkim: "Sikkim",
  tamil_nadu: "Tamil Nadu",
  telangana: "Telangana",
  tripura: "Tripura",
  uttar_pradesh: "Uttar Pradesh",
  uttarakhand: "Uttarakhand",
  west_bengal: "West Bengal",
};

export {
  PASSWORD_REGEX,
  PAGINATION_OFFSET,
  PINCODE_REGEX,
  STATES,
  BACKEND_URL,
};

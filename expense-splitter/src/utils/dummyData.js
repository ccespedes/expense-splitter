//-- Feel free to edit the dummy data to fit your needs --//
export const friendsSchema = ["id", "name", "email"];
export const dummyFriends = [
  {
    id: "_3mCYnr4CQ496CUFqrbT2",
    name: "Fred",
    email: "fred@gmail.com",
  },
  {
    id: "Bk0CSMuz_mn-4KYNx5Hw6",
    name: "Wilma",
    email: "",
  },
  {
    id: "qIt2JC0vQjEhRyIVrrXzR",
    name: "Barney",
    email: "",
  },
];

export const userSchema = ["name", "email", "id"];
export const dummyUser = [
  {
    ID: 1,
    name: "Fred",
    email: "fred@gmail.com",
    id: "EXOJIPyvbAKBvbsbESDBJ",
  },
];

export const expensesSchema = [
  "id",
  "name",
  "date",
  "description",
  "category",
  "amount",
  "groupId",
  "weight",
  "receipt_URL",
];
export const dummyExpenses = [
  {
    id: "XgortyTZ0JUbUpKRNa_gG",
    name: "Munchies",
    date: "2024-10-24T18:19:37.954Z",
    description: "Junky stuff for the trip in",
    category: "snack",
    amount: "20",
    groupId: "qmsOrnyBXVtg2-REJTa2N",
    weight: [
      {
        friendId: "_3mCYnr4CQ496CUFqrbT2",
        percentage: 33.333333333333336,
      },
      {
        friendId: "Bk0CSMuz_mn-4KYNx5Hw6",
        percentage: 33.333333333333336,
      },
      {
        friendId: "qIt2JC0vQjEhRyIVrrXzR",
        percentage: 33.333333333333336,
      },
    ],
    receipt_URL: null,
  },
  {
    id: "IbbG7jLoVrTvvL8xnH_mA",
    name: "First Night AirBNB",
    date: "2024-10-24T18:24:08.211Z",
    description: "Charming cottage house",
    category: "lodging",
    amount: "110",
    groupId: "qmsOrnyBXVtg2-REJTa2N",
    weight: [
      {
        friendId: "_3mCYnr4CQ496CUFqrbT2",
        percentage: 33.33,
      },
      {
        friendId: "Bk0CSMuz_mn-4KYNx5Hw6",
        percentage: 33.33,
      },
      {
        friendId: "qIt2JC0vQjEhRyIVrrXzR",
        percentage: 33.33,
      },
    ],
    receipt_URL: null,
  },
  {
    id: "UO-73sL_uKrqcMcR33PyA",
    name: "Airfare",
    date: "2024-10-25T02:55:54.472Z",
    description: "From LAX to BCN",
    category: "trip",
    amount: "1600",
    groupId: "injE97EaNxKbBpBdNYtsA",
    weight: [
      {
        friendId: "_3mCYnr4CQ496CUFqrbT2",
        percentage: 33.333333333333336,
      },
      {
        friendId: "Bk0CSMuz_mn-4KYNx5Hw6",
        percentage: 33.333333333333336,
      },
      {
        friendId: "qIt2JC0vQjEhRyIVrrXzR",
        percentage: 33.333333333333336,
      },
    ],
    receipt_URL: null,
  },
  {
    id: "QVlc7b_IqqGPWZqiCyk-a",
    name: "Hotel Stay",
    date: "2024-10-30T03:58:24.326Z",
    description: "First 3 nights in the city center",
    category: "lodging",
    amount: "600",
    groupId: "injE97EaNxKbBpBdNYtsA",
    weight: [
      {
        friendId: "_3mCYnr4CQ496CUFqrbT2",
        percentage: 33.333333333333336,
      },
      {
        friendId: "Bk0CSMuz_mn-4KYNx5Hw6",
        percentage: 33.333333333333336,
      },
      {
        friendId: "qIt2JC0vQjEhRyIVrrXzR",
        percentage: 33.333333333333336,
      },
    ],
    receipt_URL: null,
  },
];

export const groupSchema = [
  "id",
  "name",
  "description",
  "budget",
  "friendIDs",
  "expenseIDs",
];

export const dummyGroups = [
  {
    id: "qmsOrnyBXVtg2-REJTa2N",
    name: "Road Trip",
    description: "On the road again",
    budget: "1000",
    friendIDs: [
      "_3mCYnr4CQ496CUFqrbT2",
      "Bk0CSMuz_mn-4KYNx5Hw6",
      "qIt2JC0vQjEhRyIVrrXzR",
    ],
    expenseIDs: ["XgortyTZ0JUbUpKRNa_gG", "IbbG7jLoVrTvvL8xnH_mA"],
  },
  {
    id: "injE97EaNxKbBpBdNYtsA",
    name: "Barcelona Trip",
    description: "Sure to be unforgettable!",
    budget: "4000",
    friendIDs: [
      "_3mCYnr4CQ496CUFqrbT2",
      "Bk0CSMuz_mn-4KYNx5Hw6",
      "qIt2JC0vQjEhRyIVrrXzR",
    ],
    expenseIDs: ["UO-73sL_uKrqcMcR33PyA"],
  },
];

export const categories = [
  { name: "entertainment", icon: "fa-masks-theater" },
  { name: "gift", icon: "fa-gift" },
  { name: "groceries", icon: "fa-cart-shopping" },
  { name: "snack", icon: "fa-bowl-food" },
  { name: "restaurant", icon: "fa-utensils" },
  { name: "alchohol", icon: "fa-champagne-glasses" },
  { name: "coffee", icon: "fa-mug-saucer" },
  { name: "shopping", icon: "fa-bag-shopping" },
  // { name: "trip", icon: "fa-suitcase-rolling" },
  { name: "trip", icon: "fa-plane" },
  { name: "lodging", icon: "fa-hotel" },
  { name: "utilities", icon: "fa-toolbox" },
  { name: "other", icon: "fa-circle-dot" },
];
